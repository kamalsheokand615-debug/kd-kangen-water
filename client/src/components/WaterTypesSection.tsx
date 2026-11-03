import { waterTypes } from '../data/waterTypes';

export default function WaterTypesSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">7 Types of Water</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {waterTypes.map((w) => (
            <div key={w.id} className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: w.colour }}>{w.name}</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">pH {w.ph}</h3>
              <p className="text-gray-600 mb-4">{w.uses}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.drinkable ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {w.drinkable ? 'Drinking Safe' : 'External Use Only'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
