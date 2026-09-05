import type { LectureEmbedId } from "@/lib/lectures/types";
import Lab1StubEmbed from "./Lab1StubEmbed";
import LinkNavEmbed from "./LinkNavEmbed";
import UserCardEmbed from "./UserCardEmbed";
import WelcomeHomeEmbed from "./WelcomeHomeEmbed";

export default function LectureEmbed({ id }: { id: LectureEmbedId }) {
  switch (id) {
    case "user-card":
      return <UserCardEmbed />;
    case "welcome-home":
      return <WelcomeHomeEmbed />;
    case "lab1-stub":
      return <Lab1StubEmbed />;
    case "link-nav":
      return <LinkNavEmbed />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
