let fetchedMovieData = null;
const movieList = document.getElementById('movieList');
const searchMovie = document.getElementById('searchMovie');


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
}

function noFavMovie() {
  const li = document.createElement('li');
  li.innerHTML = `
  <i class="fa-solid fa-heart-crack" style='font-size:5rem'></i> 
  <h1 class='display-6 mt-5'> No Favourite Movie Added</h1>
  `
  const styleLi = li.style;
  styleLi.listStyle = 'none';
  styleLi.margin = '5rem 0';
  styleLi.display = 'flex';
  styleLi.flexDirection = 'column';
  styleLi.alignItems = 'center';
  styleLi.color = 'white';
  movieList.append(li);
}

function main() {
  const favMoviesArray = JSON.parse(localStorage.getItem('favMovies'));
  if (!favMoviesArray || favMoviesArray.length === 0) {
    console.log("No fav Movie Added");
    noFavMovie();
  } else {
    const tempMovies = favMoviesArray;
    tempMovies.forEach((movie, index) => {
      render(movie, index);
    })
  }
}

main();