
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface WeatherForecast {
  today: WeatherData;
  tomorrow: WeatherData;
  dayAfter: WeatherData;
}

class WeatherService {
  private mockWeatherData(): WeatherForecast {
    // Simulate real-time weather changes
    const baseTemp = 70 + Math.random() * 10;
    const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rain', 'Clear'];
    
    return {
      today: {
        temperature: Math.round(baseTemp),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        location: 'Los Angeles, CA'
      },
      tomorrow: {
        temperature: Math.round(baseTemp - 3 + Math.random() * 6),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        location: 'Los Angeles, CA'
      },
      dayAfter: {
        temperature: Math.round(baseTemp - 5 + Math.random() * 10),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        location: 'Los Angeles, CA'
      }
    };
  }

  async getWeatherForecast(): Promise<WeatherForecast> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockWeatherData();
  }
}

export const weatherService = new WeatherService();
