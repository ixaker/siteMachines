export type Type = {
  id: string;
  name: string;
  characteristics: string[];
};

class ApiClient {
  private baseUrl: string;
  private token: string;

  constructor(token: string = '') {
    this.baseUrl = process.env.ENV_BASE_URL || 'https://machines.qpart.com.ua/';
    this.token = token;
  }

  // Работа с таблицей Type
  async getTypes(): Promise<Type[]> {
    const response = await fetch(`${this.baseUrl}/type.php`);
    if (!response.ok) {
      throw new Error(`Ошибка при получении типов: ${response.statusText}`);
    }
    return response.json();
  }

  async getTypeById(id: number): Promise<Type> {
    const response = await fetch(`${this.baseUrl}/type?id=${id}`);
    if (!response.ok) {
      throw new Error(`Ошибка при получении типа с ID ${id}: ${response.statusText}`);
    }
    return response.json();
  }
  async createType(name: string): Promise<Type> {
    const formData = new FormData();
    formData.append('name', name);

    const response = await fetch(`${this.baseUrl}/type.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка при создании типа: ${response.statusText}`);
    }

    return response.json();
  }

  async updateType(id: string, name: string, characteristics: string[]): Promise<void> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('id', id.toString());
    formData.append('characteristics', JSON.stringify(characteristics));

    const response = await fetch(`${this.baseUrl}/type.php`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении типа: ${response.statusText}`);
    }
  }

  async deleteType(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/type?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Ошибка при удалении типа с ID ${id}: ${response.statusText}`);
    }
  }
}

export default ApiClient;

// Пример использования:
// const api = new ApiClient('https://example.com/api');
// api.getTypes().then(console.log).catch(console.error);
