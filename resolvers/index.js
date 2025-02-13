const bcrypt = require('bcrypt');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      return 'Login successful!';
    },
    getAllEmployees: async () => {
      return await Employee.find();
    },
    searchEmployeeByEid: async (_, { eid }) => {
      const employee = await Employee.findById(eid);
      if (!employee) throw new Error('Employee not found');
      return employee;
    },
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      return await Employee.find({
        $or: [{ designation }, { department }],
      });
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return 'Signup successful!';
    },
    addEmployee: async (_, args) => {
      const newEmployee = new Employee(args);
      return await newEmployee.save();
    },
    updateEmployeeByEid: async (_, { eid, ...updates }) => {
      const employee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
      if (!employee) throw new Error('Employee not found');
      return employee;
    },
    deleteEmployeeByEid: async (_, { eid }) => {
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) throw new Error('Employee not found');
      return 'Employee deleted successfully!';
    },
  },
};

module.exports = resolvers;
