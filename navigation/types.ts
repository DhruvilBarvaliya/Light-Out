export type AppScreen = 'home' | 'casual' | 'levels' | 'level';

export interface NavigationState {
  screen: AppScreen;
  activeLevel: number | null;
}
