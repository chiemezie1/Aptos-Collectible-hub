import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockCollections = [
  { id: 1, name: "Bored Ape Yacht Club", floor: 5.5, volume: 1234, image: "https://picsum.photos/id/247/400/400" },
  { id: 2, name: "CryptoPunks", floor: 8.2, volume: 987, image: "https://picsum.photos/id/248/400/400" },
  { id: 3, name: "Doodles", floor: 3.7, volume: 567, image: "https://picsum.photos/id/249/400/400" },
  { id: 4, name: "Azuki", floor: 4.1, volume: 789, image: "https://picsum.photos/id/250/400/400" },
];

const TrendingCollections = () => {
  return (
    <section className="py-16 bg-gray-900 rounded-lg shadow-2xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Trending Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={collection.image} alt={collection.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Floor: {collection.floor} ETH</span>
                  <span>Volume: {collection.volume} ETH</span>
                </div>
              </div>
              <Link to={`/collection/${collection.id}`} className="block bg-blue-500 text-white text-center py-2 hover:bg-blue-600 transition-colors duration-300">
                View Collection
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCollections;

