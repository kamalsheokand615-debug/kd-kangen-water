export interface WaterType {
  id: number;
  name: string;
  ph: string;
  colour: string;
  uses: string;
  drinkable: boolean;
}

export const waterTypes: WaterType[] = [
  { id: 1, name: 'Strong Acidic Water', ph: '2.5', colour: '#E53935', uses: 'For external use only: disinfecting, hand washing, cleaning the kitchen and bathroom. Not for drinking.', drinkable: false },
  { id: 2, name: 'Beauty Water', ph: '4.0-6.0', colour: '#FB8C00', uses: 'For external use: face wash, hair wash, skin care. Not for drinking.', drinkable: false },
  { id: 3, name: 'Clean Drinking Water', ph: '7.0', colour: '#43A047', uses: 'Neutral pH. For taking medicine, preparing baby formula, drinking for children, and cooking (rice, lentils, vegetables, tea/coffee).', drinkable: true },
  { id: 4, name: 'Kangen Water', ph: '8.5', colour: '#00897B', uses: 'For drinking, for new users and when taking medicine (mildest level).', drinkable: true },
  { id: 5, name: 'Kangen Water', ph: '9.0', colour: '#1E88E5', uses: 'For daily drinking.', drinkable: true },
  { id: 6, name: 'Kangen Water', ph: '9.5', colour: '#1A3FA0', uses: 'For drinking only.', drinkable: true },
  { id: 7, name: 'Strong Kangen Water', ph: '11.5', colour: '#7B1FA2', uses: 'For external use only.', drinkable: false },
];
