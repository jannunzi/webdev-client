/** Section 1.3.5 — Remote and local images */
export default function Images() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <div id="wd-images">
        <h4>Image tag</h4>
        Loading an image from the internet:
        <br />
        <img
          id="wd-starship"
          width="400px"
          alt="Starship"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
        />
        <br />
        Loading a local image:
        <br />
        <img
          id="wd-teslabot"
          src="/images/teslabot.jpg"
          height="200px"
          alt="Tesla Bot (Optimus) humanoid robot"
        />
      </div>
    </div>
  );
}
