import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [currentId, setCurrentId] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPokemon(currentId);
  }, [currentId]);

  const fetchPokemon = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) throw new Error('Pokemon not found!');
      const details = await response.json();

      const speciesRes = await fetch(details.species.url);
      const species = await speciesRes.json();

      setCurrentPokemon({
        ...details,
        isLegendary: species.is_legendary || species.is_mythical
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`);
      if (!response.ok) throw new Error('Pokemon not found!');
      const details = await response.json();

      const speciesRes = await fetch(details.species.url);
      const species = await speciesRes.json();

      setCurrentId(details.id);
      setCurrentPokemon({
        ...details,
        isLegendary: species.is_legendary || species.is_mythical
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentId > 1) {
      setCurrentId(prev => prev - 1);
    }
  };

  const handleNext = () => {
    setCurrentId(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo">PokéCard Viewer</h1>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search Pokemon by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main className="viewer-main">
        {loading && <div className="loading">Loading Pokemon...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && currentPokemon && (
          <div className="card-navigation">
            <button
              onClick={handlePrev}
              disabled={currentId === 1}
              className="nav-btn prev-btn"
            >
              ← Previous
            </button>

            <div className={`pokemon-card ${currentPokemon.types[0].type.name} ${currentPokemon.isLegendary ? 'legendary' : ''}`}>
              <div className="card-inner">
                <div className="card-header">
                  <span className="poke-id">#{currentPokemon.id}</span>
                  <h2 className="poke-name">{currentPokemon.name.toUpperCase()}</h2>
                </div>

                <div className="image-container">
                  <img
                    src={currentPokemon.sprites.other['official-artwork'].front_default}
                    alt={currentPokemon.name}
                    className="poke-image"
                  />
                  {currentPokemon.isLegendary && <div className="legendary-badge">LEGENDARY</div>}
                </div>

                <div className="type-container">
                  {currentPokemon.types.map(t => (
                    <span key={t.type.name} className={`type-tag ${t.type.name}`}>
                      {t.type.name}
                    </span>
                  ))}
                </div>

                <div className="stats-container">
                  <div className="stat-row">
                    <span>HP</span>
                    <span className="stat-val">{currentPokemon.stats[0].base_stat}</span>
                  </div>
                  <div className="stat-row">
                    <span>ATTACK</span>
                    <span className="stat-val">{currentPokemon.stats[1].base_stat}</span>
                  </div>
                  <div className="stat-row">
                    <span>DEFENSE</span>
                    <span className="stat-val">{currentPokemon.stats[2].base_stat}</span>
                  </div>
                  <div className="stat-row">
                    <span>SPEED</span>
                    <span className="stat-val">{currentPokemon.stats[5].base_stat}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="nav-btn next-btn"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
