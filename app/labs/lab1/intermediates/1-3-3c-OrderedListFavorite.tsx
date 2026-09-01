/** Section 1.3.3 — Ordered lists including a sample favorite recipe */
export default function OrderedListFavorite() {
  return (
    <div id="wd-lists">
      <h4>List Tags</h4>
      <h5>Ordered List Tag</h5>
      How to make pancakes:
      <ol id="wd-pancakes">
        <li>Mix dry ingredients.</li>
        <li>Add wet ingredients.</li>
        <li>Stir to combine.</li>
        <li>Heat a skillet or griddle.</li>
        <li>Pour batter onto the skillet.</li>
        <li>Cook until bubbly on top.</li>
        <li>Flip and cook the other side.</li>
        <li>Serve and enjoy!</li>
      </ol>
      My favorite recipe:
      <ol id="wd-your-favorite-recipe">
        <li>Boil water and cook pasta until al dente.</li>
        <li>Sauté garlic in olive oil, then add crushed tomatoes.</li>
        <li>Toss pasta with sauce and top with grated Parmesan.</li>
      </ol>
    </div>
  );
}
