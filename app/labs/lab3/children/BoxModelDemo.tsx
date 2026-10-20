import Margin from "./Margin";
import Border from "./Border";
import Padding from "./Padding";
import Content from "./Content";

export default function BoxModelDemo() {
  return (
    <div id="wd-box-model-demo" style={{ backgroundColor: "white" }}>
      <Margin margin={20}>
        <Border width={6} color="black" radius={8}>
          <Padding padding={20}>
            <Content width={120} height={40}>
              Hello
            </Content>
          </Padding>
        </Border>
      </Margin>
    </div>
  );
}
