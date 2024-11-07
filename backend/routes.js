import {Sequelize, DataTypes} from 'sequelize';
import * as bcrypt from 'bcrypt';

const sequelize = new Sequelize({dialect: 'sqlite', storage: ':memory:'});

const User = sequelize.define('User', {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  name: DataTypes.STRING,
});

const TodoList = sequelize.define('TodoList', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: DataTypes.STRING
});

const TodoItem = sequelize.define('TodoItem', {
  listId: {
    type: DataTypes.INTEGER,
    references: {
      model: TodoList,
      key: 'id'
    }
  },
  content: DataTypes.STRING,
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Set the default value to false
  },
});

// Set up associations
TodoList.hasMany(TodoItem, {foreignKey: 'listId', onDelete: 'CASCADE'});
TodoItem.belongsTo(TodoList, {foreignKey: 'listId'});

try {
  await sequelize.authenticate();
  await sequelize.sync({force: true});
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default function (fastify, options, done) {
  // Register an account
  fastify.post('/sign-up', async (request, reply) => {
    const {email, password, name} = request.body;

    const whereConditions = {};
    whereConditions.email = {[Sequelize.Op.eq]: email};

    const existingUser = await User.findOne({where: whereConditions});

    if (existingUser?.id) return reply.code(403).send({message: 'Email in use.'});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({name, email, password: hashedPassword})

    if (!newUser) return reply.code(400).send({message: 'Unable to create account at the moment.'});

    reply.send({message: 'Account created successfully.'})
  });

  fastify.get('/users-list', async (request, reply) => {
    return reply.send(await User.findAll());
  })

  // Log into account
  fastify.post('/log-in', async (request, reply) => {
    const {email, password} = request.body;

    const user = await User.findOne({where: {email}});

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(403).send({message: 'Invalid username or password'});
    }

    const token = fastify.jwt.sign({userId: user.id}, {expiresIn: '6h'})

    reply.send({token, name: user.name, message: 'Logged in successfully.'});
  });

  // To-do list operations

  fastify.get('/todo-list', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const items = await TodoList.findAll({
      where: {userId: request.user.userId},
      order: [['createdAt', 'DESC']]
    });

    reply.send(items)
  });

  // Return a full to do list.
  fastify.get('/todo-list/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const todoList = await TodoList.findOne({
      where: {id, userId: request.user.userId},
      include: {
        model: TodoItem,
        attributes: ['id', 'content', 'done'],
      }
    });

    if (!todoList) {
      return reply.code(404).send({error: 'Todo list not found'});
    }

    // Format the response
    const response = {
      title: todoList.title,
      items: todoList.TodoItems
    };

    reply.send(response)
  });

  // Create new to-do-list
  fastify.post('/todo-list', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    // request.body;
    const list = await TodoList.create({
      userId: request.user.userId,
      title: request.body.title,
    });

    reply.send(list);
  });

  // Create new to-do-item
  fastify.post('/todo-list/:id/todo-items', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const item = await TodoItem.create({
      listId: id,
      content: request.body.content,
    });

    reply.send(item);
  });

  // toggle item done
  fastify.put('/todo-list/:id/todo-items/:item_id/toggle', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id, item_id} = request.params;
    const item = await TodoItem.findOne({where: {listId: id, id: item_id}});

    item.done = !item.done;

    await item.save();

    reply.send(item);
  });

  // Delete a to-do list record, with its children
  fastify.delete('/todo-list/:id/todo-items/:item_id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id, item_id} = request.params;
    const item = await TodoItem.findOne({where: {listId: id, id: item_id}});
    if (!item) return reply.code(404).send({message: "Item not found."});
    await item.destroy();
    reply.code(204).send();
  });

  // Update a single to-do item record
  fastify.put('/todo-list/:id/todo-items/:item_id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id, item_id} = request.params;
    const item = await TodoItem.findOne({where: {listId: id, id: item_id}});
    if (!item) return reply.code(404).send({message: "Item not found."});

    item.content = request.body.content;

    await item.save();

    reply.send(item);
  });

  // Update a single to-do list record
  fastify.put('/todo-list/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const list = await TodoList.findByPk(id);
    if (!list) reply.code(404).send({message: "List not found."});

    list.title = request.body.title;

    await list.save();

    reply.send(list);
  });

  // Delete a to-do list record, with its children
  fastify.delete('/todo-list/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const list = await TodoList.findOne({where: {id, userId: request.user.userId}});
    if (!list) return reply.code(404).send({message: "List not found."});
    await list.destroy();
    reply.code(204).send();
  });

  done();
}
