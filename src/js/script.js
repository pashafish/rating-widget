document.addEventListener('DOMContentLoaded', () => {
  let articles = document.querySelectorAll('.article');
  articles.forEach(article => {
    let ratingWidget = new RatingWidget(article);
  })
});
