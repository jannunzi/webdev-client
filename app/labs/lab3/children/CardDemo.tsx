import Card from "./Card";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import Highlight from "../Highlight";
import Square from "../Square";

export default function CardDemo() {
  return (
    <div id="wd-card-demo">
      <Card>
        <CardHeader>Lab 3 Card</CardHeader>
        <CardBody>
          <p>
            Children can be <b>tags</b>, <Highlight>components</Highlight>,
            or both.
          </p>
          <p>
            The square of 3 is <Square>3</Square>.
          </p>
          <button>Got it</button>
        </CardBody>
      </Card>
    </div>
  );
}
