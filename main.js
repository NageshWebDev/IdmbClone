import { movieData } from './utility.js'

let fetchedMovieData = null;
let favMoviesArray = [];
let movies = movieData.map((movie) => { return { ...movie, Fav: false, backgroundColor: 'lightgray', color: 'lightgray' } });
const movieList = document.getElementById('movieList');
const searchMovie = document.getElementById('searchMovie');

// localStorage.clear();
if (!localStorage.getItem('favMovies')) {
    console.log('local storage for favMovies NULL')
} else if (localStorage.getItem('favMovies')) {
    favMoviesArray = JSON.parse(localStorage.getItem('favMovies'))
    localStorage.setItem('favMovies', JSON.stringify(favMoviesArray));
    console.log(favMoviesArray)
}

if (!localStorage.getItem('movies')) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function render(item, index = Math.random()) {
    // add new movie to the List
    const li = document.createElement('li');
    li.innerHTML = `
      <i id=heart${index} class="my-4 fa-solid fa-heart fa-2xl" style="cursor:pointer; color:${item.color}; background-color:${item.backgroundColor}; width: 25%" ></i>
    
      <button class="btn" style="width:55%; background-color: goldenrod; color:black;" type="button" data-bs-toggle="collapse" data-bs-target="#movie${index}">
        <div class='p-2 d-flex justify-content-between align-items-center' style='width:100%;'>
        <i class="fa-solid fa-play fa-lg me-3" style='transform:rotate(212deg)'></i>
        <h1 class='display-6 flex-fill text-start'>${item.Title}</h1>
        <i class="fa-solid fa-film fa-2xl mx-2"></i>
      </button>
    
      <div class="collapse" style="width:55%; " id="movie${index}">
      <div class="card card-body d-flex justify-content-between align-items-center p-3">
       <img class='m-0' style='background-color:cyan' src=${item.Poster} height='300px'></img>
       <p class='m-0'>${item.Title}</p>
       <p class='m-0'>${item.Year}</p>
       <p class='m-0'>${item.Language}</p>
       <p class='m-0'>Cast : ${item.Actors}</p>
       <p class='m-0'>ImdbRating : ${item.imdbRating}</p>
       <small class='m-0'><i>"${item.Plot}"</i></small>
      </div>
    </div>
        `
    const styleLi = li.style;
    styleLi.listStyle = 'none';
    styleLi.margin = '5rem 0';
    styleLi.display = 'flex';
    styleLi.flexDirection = 'column';
    styleLi.alignItems = 'center';
    movieList.prepend(li);

    document.getElementById(`heart${index}`).addEventListener('click', function toggleFav(event) {
        event.stopPropagation();
        const heartColor = this.style.color;
        if (heartColor === 'lightgray') {
            this.style.color = 'tomato';
            this.style.backgroundColor = 'tomato';

            item = { ...item, Fav: true, backgroundColor: 'tomato', color: "tomato" }
            let localMovieData = JSON.parse(localStorage.getItem('movies'))
            const index = localMovieData.findIndex((movie) => { return movie.Title === item.Title });

            localMovieData[index] = { ...localMovieData[index], backgroundColor: "tomato", color: "tomato" };
            localStorage.setItem('movies', JSON.stringify(localMovieData))

            let favMovies = localStorage.getItem('favMovies');
            if (!favMovies) {
                favMoviesArray.push(item);
                localStorage.setItem('favMovies', JSON.stringify(favMoviesArray));
            } else {
                favMoviesArray = [...favMoviesArray, item];
                localStorage.setItem('favMovies', JSON.stringify(favMoviesArray));
            }

        } else if (heartColor === 'tomato') {
            this.style.color = 'lightgray';
            this.style.backgroundColor = 'lightgray';

            let localMovieData = JSON.parse(localStorage.getItem('movies'))
            const index = localMovieData.findIndex((movie) => { return movie.Title === item.Title });

            localMovieData[index] = { ...localMovieData[index], backgroundColor: "lightgray", color: "lightgray" };
            localStorage.setItem('movies', JSON.stringify(localMovieData))

            let favMovies = localStorage.getItem('favMovies');
            if (!favMovies) {
                console.log('No movie Added')
            } else {
                favMoviesArray = [...favMoviesArray, item];
                const favMovies = JSON.parse(localStorage.getItem('favMovies'));
                const newFavList = favMovies.filter((movie) => { return movie.Title != item.Title });
                localStorage.setItem('favMovies', JSON.stringify(newFavList));
            }
        }
    })

}

searchMovie.addEventListener('submit', async function search(event) {
    event.preventDefault();
    const getMovieName = searchMovie[0].value;
    const foundMovie = await fetch(`http://www.omdbapi.com/?t=${getMovieName}&apikey=86f4b0b2`);
    const foundMovieJSON = await foundMovie.json();
    fetchedMovieData = foundMovieJSON;
    displayMovie(fetchedMovieData);
    searchMovie[0].value = '';
})

function displayMovie(fetchedMovieData) {
    if (fetchedMovieData.Response) {
        const div = document.createElement('div');
        div.innerHTML = `
            <img class='m-0' style='background-color:cyan' src=${fetchedMovieData.Poster} height='300px'></img>
            <div class='p-3'>
            <p class='m-0 display-6'>${fetchedMovieData.Title}</p>
            <p class='m-0'>${fetchedMovieData.Year}</p>
            <p class='m-0'>${fetchedMovieData.Language}</p>
            <p class='m-0'>Cast : ${fetchedMovieData.Actors}</p>
            <p class='m-0'>ImdbRating : ${fetchedMovieData.imdbRating}</p>
            <small class='m-0'><i>"${fetchedMovieData.Plot}"</i></small>
            </div>
            <div class='p-3 d-flex flex-column align-item-start' style='height:100%; width:25%; '>
            <div id='addToList' class="d-flex justify-content-center align-items-center p-3" style='background-color:#333; color:white; cursor:pointer; height:50%;'> <p>+ Add To List </p></div>
            <div id='clear' class="d-flex justify-content-center align-items-center p-3" style='background-color:tomato; cursor:pointer; height:50%;'> <p>- Clear</p> </div>
            </div>
            `

        const styleDiv = div.style;
        styleDiv.marginTop = '5rem';
        styleDiv.backgroundColor = 'goldenrod';
        styleDiv.display = 'flex';
        styleDiv.flexDirection = 'row';
        styleDiv.alignItems = 'center';
        styleDiv.color = 'black';
        styleDiv.width = '75%';

        document.getElementById('movieDiv').appendChild(div);

        document.getElementById('addToList').addEventListener('click', () => {
            const movieData = JSON.parse(localStorage.getItem('movies'))
            const addMovie = { ...fetchedMovieData, Fav: false, backgroundColor: 'lightgray', color: 'lightgray' }
            const newList = [...movieData, addMovie]
            console.log(addMovie)
            localStorage.setItem('movies', JSON.stringify(newList))
            render(addMovie);
            document.getElementById('movieDiv').removeChild(div);
        });

        document.getElementById('clear').addEventListener('click', () => {
            document.getElementById('movieDiv').removeChild(div);
        })
    } else {

    }
}

function main() {
    const movies = JSON.parse(localStorage.getItem('movies'));
    console.log(movies)
    const tempMovies = movies;
    tempMovies.forEach((movie, index) => {
        render(movie, index);
    })
}

main();