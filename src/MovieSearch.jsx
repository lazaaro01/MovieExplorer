import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from './assets/img/fundo.jpg';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    if (query === '') return;

    setLoading(true);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${query}&y=${year}&type=${type}&apikey=fdb4fc6b`);
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
    setLoading(false);
  };

  const handleMovieClick = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=fdb4fc6b`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">MovieExplorer</h1>

        <div className="flex justify-center mb-4 gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-l-md w-1/2 lg:w-1/3 bg-gray-800 text-white"
            placeholder="Digite o nome do filme"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-all"
          >
            Buscar
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Ano (ex: 2020)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 p-2 rounded-md bg-gray-800 text-gray-60"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 p-2 rounded-md bg-gray-800 text-white"
          >
            <option value="">Tipo</option>
            <option value="movie">Filme</option>
            <option value="series">Série</option>
            <option value="episode">Episódio</option>
          </select>
        </div>
    
        {loading && <p className="text-center text-xl">Carregando...</p>}

        {selectedMovie ? (
          <div className="text-center bg-gray-600 bg-opacity-80 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold">{selectedMovie.Title}</h2>
            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
              className="w-48 h-72 object-cover mb-4 mx-auto"
            />
            <p><strong>Ano:</strong> {selectedMovie.Year}</p>
            <p><strong>Tipo:</strong> {selectedMovie.Type}</p>
            <p className="text-gray-200"><strong>Sinopse:</strong> {selectedMovie.Plot}</p>
            {selectedMovie.Type === "series" && selectedMovie.totalSeasons && (
              <p><strong>Temporadas:</strong> {selectedMovie.totalSeasons}</p>
            )}
            <button
              onClick={() => setSelectedMovie(null)}
              className="bg-gray-900 text-white p-2 rounded-md mt-4 hover:bg-gray-700 transition-all"
            >
              Voltar aos Resultados
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all" onClick={() => handleMovieClick(movie.imdbID)}>
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}
                  alt={movie.Title}
                  className="w-full h-64 object-cover mb-4 rounded-md"
                />
                <h2 className="font-bold text-lg">{movie.Title}</h2>
                <p className="text-gray-600">{movie.Year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
