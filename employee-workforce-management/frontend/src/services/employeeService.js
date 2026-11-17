import { api } from './api';

export const employeeService = {
  async getEmployees(companyId = 1) {
    return api.getEmployees(companyId);
  },

  async getEmployeeById(id) {
    const list = await api.getEmployees(1);
    return list.find(emp => emp.id === Number(id)) || null;
  },

  async createEmployee(payload) {
    return api.createEmployee(payload);
  },

  async updateEmployee(id, payload) {
    return api.updateEmployee(id, payload);
  },

  async deleteEmployee(id) {
    return api.deleteEmployee(id);
  },

  async getDepartments(companyId = 1) {
    return api.getDepartments(companyId);
  },

  async updateWorkStatus(employeeId, workStatus) {
    return api.updateWorkStatus(employeeId, workStatus);
  }
};

export default employeeService;

