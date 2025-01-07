export type Type = {
  id: number;
  name: string;
};

export type Characteristic = {
  id: number;
  name: string;
  type_id: number;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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

  async updateType(id: number, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('id', id.toString());

    const response = await fetch(`${this.baseUrl}/type.php`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении типа: ${response.statusText}`);
    }
  }

  async deleteType(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/type.php?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Ошибка при удалении типа с ID ${id}: ${response.statusText}`);
    }
  }

  // Работа с таблицей Characteristics
  async getCharacteristics(typeId?: number): Promise<Characteristic[]> {
    const url = typeId ? `${this.baseUrl}/characteristics?type_id=${typeId}` : `${this.baseUrl}/characteristics.php`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка при получении характеристик: ${response.statusText}`);
    }
    return response.json();
  }

  async getCharacteristicById(id: number): Promise<Characteristic> {
    const response = await fetch(`${this.baseUrl}/characteristics?id=${id}`);
    if (!response.ok) {
      throw new Error(`Ошибка при получении характеристики с ID ${id}: ${response.statusText}`);
    }
    return response.json();
  }

  async createCharacteristic(name: string, typeId: number): Promise<Characteristic> {
    const response = await fetch(`${this.baseUrl}/characteristics.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type_id: typeId }),
    });
    if (!response.ok) {
      throw new Error(`Ошибка при создании характеристики: ${response.statusText}`);
    }
    return response.json();
  }

  async updateCharacteristic(id: number, name: string, typeId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/characteristics.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, type_id: typeId }),
    });
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении характеристики: ${response.statusText}`);
    }
  }

  async deleteCharacteristic(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/characteristics?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Ошибка при удалении характеристики с ID ${id}: ${response.statusText}`);
    }
  }
}

export default ApiClient;

// Пример использования:
// const api = new ApiClient('https://example.com/api');
// api.getTypes().then(console.log).catch(console.error);
