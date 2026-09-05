import type { LectureEmbedId } from "@/lib/lectures/types";
import AnchorsEmbed from "./AnchorsEmbed";
import FileFieldEmbed from "./FileFieldEmbed";
import HashTocEmbed from "./HashTocEmbed";
import HeadingScaleEmbed from "./HeadingScaleEmbed";
import HeadingTagsEmbed from "./HeadingTagsEmbed";
import HtmlSkeletonEmbed from "./HtmlSkeletonEmbed";
import Lab1StubEmbed from "./Lab1StubEmbed";
import LabsIndexEmbed from "./LabsIndexEmbed";
import LinkNavEmbed from "./LinkNavEmbed";
import ListTagsEmbed from "./ListTagsEmbed";
import MailtoTelEmbed from "./MailtoTelEmbed";
import ParagraphTagEmbed from "./ParagraphTagEmbed";
import RadioButtonsEmbed from "./RadioButtonsEmbed";
import TablesEmbed from "./TablesEmbed";
import TextFieldsEmbed from "./TextFieldsEmbed";
import TypedFieldsEmbed from "./TypedFieldsEmbed";
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
    case "heading-tags":
      return <HeadingTagsEmbed />;
    case "paragraph-tag":
      return <ParagraphTagEmbed />;
    case "list-tags":
      return <ListTagsEmbed />;
    case "tables":
      return <TablesEmbed />;
    case "text-fields":
      return <TextFieldsEmbed />;
    case "anchors":
      return <AnchorsEmbed />;
    case "labs-index":
      return <LabsIndexEmbed />;
    case "html-skeleton":
      return <HtmlSkeletonEmbed />;
    case "heading-scale":
      return <HeadingScaleEmbed />;
    case "radio-buttons":
      return <RadioButtonsEmbed />;
    case "file-field":
      return <FileFieldEmbed />;
    case "typed-fields":
      return <TypedFieldsEmbed />;
    case "mailto-tel":
      return <MailtoTelEmbed />;
    case "hash-toc":
      return <HashTocEmbed />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
