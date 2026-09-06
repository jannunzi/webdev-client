import type { LectureEmbedId } from "@/lib/lectures/types";
import AlertButtonEmbed from "./AlertButtonEmbed";
import AnchorsEmbed from "./AnchorsEmbed";
import ButtonsEmbed from "./ButtonsEmbed";
import CheckboxesEmbed from "./CheckboxesEmbed";
import DropdownsEmbed from "./DropdownsEmbed";
import FileFieldEmbed from "./FileFieldEmbed";
import HashTocEmbed from "./HashTocEmbed";
import HeadingScaleEmbed from "./HeadingScaleEmbed";
import HeadingTagsEmbed from "./HeadingTagsEmbed";
import HtmlSkeletonEmbed from "./HtmlSkeletonEmbed";
import Lab1StubEmbed from "./Lab1StubEmbed";
import LabsIndexEmbed from "./LabsIndexEmbed";
import {
  KambazAccountNavEmbed,
  KambazLandingEmbed,
  KambazProfileEmbed,
  KambazSigninEmbed,
  KambazSignupEmbed,
} from "./KambazAccountEmbeds";
import {
  KambazDashboardEmbed,
  KambazNavigationEmbed,
} from "./KambazChromeEmbeds";
import {
  KambazAssignmentEditorEmbed,
  KambazAssignmentsEmbed,
  KambazCoursesEmbed,
  KambazHomeEmbed,
  KambazModulesEmbed,
} from "./KambazCourseEmbeds";
import LabsLayoutEmbed from "./LabsLayoutEmbed";
import LinkNavEmbed from "./LinkNavEmbed";
import ListTagsEmbed from "./ListTagsEmbed";
import MailtoTelEmbed from "./MailtoTelEmbed";
import ParagraphTagEmbed from "./ParagraphTagEmbed";
import RadioButtonsEmbed from "./RadioButtonsEmbed";
import TablesEmbed from "./TablesEmbed";
import TextareaEmbed from "./TextareaEmbed";
import TextFieldsEmbed from "./TextFieldsEmbed";
import TypedFieldsEmbed from "./TypedFieldsEmbed";
import UserCardEmbed from "./UserCardEmbed";
import WelcomeHomeEmbed from "./WelcomeHomeEmbed";
import {
  CssBackgroundEmbed,
  CssBordersEmbed,
  CssBoxModelEmbed,
  CssClassSelectorsEmbed,
  CssCornersEmbed,
  CssDimensionsEmbed,
  CssDisplayEmbed,
  CssFlexGrowEmbed,
  CssFlexRowEmbed,
  CssFlexWidthEmbed,
  CssFloatEmbed,
  CssForegroundEmbed,
  CssGradientEmbed,
  CssGridLayoutEmbed,
  CssIdSelectorsEmbed,
  CssImportEmbed,
  CssMarginsEmbed,
  CssMediaQueriesEmbed,
  CssPaddingEmbed,
  CssPositionAbsoluteEmbed,
  CssPositionFixedEmbed,
  CssPositionRelativeEmbed,
  CssRotateEmbed,
  CssStructureSelectorsEmbed,
  CssStyleAttrEmbed,
  CssZindexEmbed,
} from "./CssLabEmbeds";
import {
  ReactIconsEmbed,
  TailwindBackgroundsEmbed,
  TailwindFiltersEmbed,
  TailwindFlexEmbed,
  TailwindGridsEmbed,
  TailwindResponsiveEmbed,
  TailwindSpacingEmbed,
  TailwindTypographyEmbed,
} from "./TailwindLabEmbeds";
import {
  KambazStyledAssignmentsEmbed,
  KambazStyledCourseNavEmbed,
  KambazStyledDashboardEmbed,
  KambazStyledHomeEmbed,
  KambazStyledModulesEmbed,
  KambazStyledNavEmbed,
  KambazStyledPeopleEmbed,
  KambazStyledSigninEmbed,
} from "./KambazStylingEmbeds";
import {
  JsArrowFunctionsEmbed,
  JsBooleansEmbed,
  JsConditionalIfElseEmbed,
  JsConditionalInlineEmbed,
  JsIfElseEmbed,
  JsImpliedReturnEmbed,
  JsLegacyFunctionsEmbed,
  JsNullUndefinedEmbed,
  JsTemplateLiteralsEmbed,
  JsTernaryEmbed,
  JsVariableTypesEmbed,
  JsVariablesEmbed,
  Lab3StubEmbed,
} from "./Lab3Embeds";

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
    case "textarea":
      return <TextareaEmbed />;
    case "checkboxes":
      return <CheckboxesEmbed />;
    case "dropdowns":
      return <DropdownsEmbed />;
    case "alert-button":
      return <AlertButtonEmbed />;
    case "buttons":
      return <ButtonsEmbed />;
    case "labs-layout":
      return <LabsLayoutEmbed />;
    case "kambaz-landing":
      return <KambazLandingEmbed />;
    case "kambaz-signin":
      return <KambazSigninEmbed />;
    case "kambaz-signup":
      return <KambazSignupEmbed />;
    case "kambaz-profile":
      return <KambazProfileEmbed />;
    case "kambaz-account-nav":
      return <KambazAccountNavEmbed />;
    case "kambaz-dashboard":
      return <KambazDashboardEmbed />;
    case "kambaz-navigation":
      return <KambazNavigationEmbed />;
    case "kambaz-courses":
      return <KambazCoursesEmbed />;
    case "kambaz-modules":
      return <KambazModulesEmbed />;
    case "kambaz-home":
      return <KambazHomeEmbed />;
    case "kambaz-assignments":
      return <KambazAssignmentsEmbed />;
    case "kambaz-assignment-editor":
      return <KambazAssignmentEditorEmbed />;
    case "css-style-attr":
      return <CssStyleAttrEmbed />;
    case "css-import":
      return <CssImportEmbed />;
    case "css-id-selectors":
      return <CssIdSelectorsEmbed />;
    case "css-class-selectors":
      return <CssClassSelectorsEmbed />;
    case "css-structure-selectors":
      return <CssStructureSelectorsEmbed />;
    case "css-foreground":
      return <CssForegroundEmbed />;
    case "css-background":
      return <CssBackgroundEmbed />;
    case "css-borders":
      return <CssBordersEmbed />;
    case "css-padding":
      return <CssPaddingEmbed />;
    case "css-margins":
      return <CssMarginsEmbed />;
    case "css-box-model":
      return <CssBoxModelEmbed />;
    case "css-corners":
      return <CssCornersEmbed />;
    case "css-dimensions":
      return <CssDimensionsEmbed />;
    case "css-display":
      return <CssDisplayEmbed />;
    case "css-position-relative":
      return <CssPositionRelativeEmbed />;
    case "css-position-absolute":
      return <CssPositionAbsoluteEmbed />;
    case "css-position-fixed":
      return <CssPositionFixedEmbed />;
    case "css-zindex":
      return <CssZindexEmbed />;
    case "css-float":
      return <CssFloatEmbed />;
    case "css-grid-layout":
      return <CssGridLayoutEmbed />;
    case "css-flex-row":
      return <CssFlexRowEmbed />;
    case "css-flex-grow":
      return <CssFlexGrowEmbed />;
    case "css-flex-width":
      return <CssFlexWidthEmbed />;
    case "css-media-queries":
      return <CssMediaQueriesEmbed />;
    case "css-rotate":
      return <CssRotateEmbed />;
    case "css-gradient":
      return <CssGradientEmbed />;
    case "react-icons":
      return <ReactIconsEmbed />;
    case "tw-spacing":
      return <TailwindSpacingEmbed />;
    case "tw-typography":
      return <TailwindTypographyEmbed />;
    case "tw-backgrounds":
      return <TailwindBackgroundsEmbed />;
    case "tw-filters":
      return <TailwindFiltersEmbed />;
    case "tw-flex":
      return <TailwindFlexEmbed />;
    case "tw-grids":
      return <TailwindGridsEmbed />;
    case "tw-responsive":
      return <TailwindResponsiveEmbed />;
    case "kambaz-styled-nav":
      return <KambazStyledNavEmbed />;
    case "kambaz-styled-dashboard":
      return <KambazStyledDashboardEmbed />;
    case "kambaz-styled-course-nav":
      return <KambazStyledCourseNavEmbed />;
    case "kambaz-styled-modules":
      return <KambazStyledModulesEmbed />;
    case "kambaz-styled-home":
      return <KambazStyledHomeEmbed />;
    case "kambaz-styled-people":
      return <KambazStyledPeopleEmbed />;
    case "kambaz-styled-assignments":
      return <KambazStyledAssignmentsEmbed />;
    case "kambaz-styled-signin":
      return <KambazStyledSigninEmbed />;
    case "lab3-stub":
      return <Lab3StubEmbed />;
    case "js-variables":
      return <JsVariablesEmbed />;
    case "js-variable-types":
      return <JsVariableTypesEmbed />;
    case "js-booleans":
      return <JsBooleansEmbed />;
    case "js-if-else":
      return <JsIfElseEmbed />;
    case "js-ternary":
      return <JsTernaryEmbed />;
    case "js-conditional-if-else":
      return <JsConditionalIfElseEmbed />;
    case "js-conditional-inline":
      return <JsConditionalInlineEmbed />;
    case "js-null-undefined":
      return <JsNullUndefinedEmbed />;
    case "js-legacy-functions":
      return <JsLegacyFunctionsEmbed />;
    case "js-arrow-functions":
      return <JsArrowFunctionsEmbed />;
    case "js-implied-return":
      return <JsImpliedReturnEmbed />;
    case "js-template-literals":
      return <JsTemplateLiteralsEmbed />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
