import api from './api';

// Simplified types based on the schema.graphql for the dashboard
export interface CityStats {
  totalPOIs: number;
  totalEvents: number;
  totalZones: number;
  totalCategories: number;
  averageRating: number;
  upcomingEventsCount: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  zone: {
    name: string;
  };
  startDate: string;
  isFree: boolean;
}

// Function to execute a GraphQL query
const graphqlQuery = async (query: string, variables: Record<string, any> = {}) => {
  const response = await api.post('/graphql', {
    query,
    variables,
  });

  if (response.data.errors) {
    throw new Error(response.data.errors.map((e: any) => e.message).join('\n'));
  }

  return response.data.data;
};

// Specific query functions
export const getCityStats = async (): Promise<CityStats> => {
  const query = `
    query GetCityStats {
      cityStats {
        totalPOIs
        totalEvents
        totalZones
        averageRating
        upcomingEventsCount
      }
    }
  `;
  const data = await graphqlQuery(query);
  return data.cityStats;
};

export const getUpcomingEvents = async (limit: number = 5): Promise<UpcomingEvent[]> => {
  const query = `
    query GetUpcomingEvents($limit: Int) {
      upcomingEvents(limit: $limit) {
        id
        title
        zone {
          name
        }
        startDate
        isFree
      }
    }
  `;
  const data = await graphqlQuery(query, { limit });
  return data.upcomingEvents;
};
