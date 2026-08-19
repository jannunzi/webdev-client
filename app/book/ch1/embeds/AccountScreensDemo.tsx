import Signin from "@/app/(kambaz)/account/signin/page";
import Signup from "@/app/(kambaz)/account/signup/page";
import Profile from "@/app/(kambaz)/account/profile/page";
import AccountNavigation from "@/app/(kambaz)/account/Navigation";

/** Account screens side-by-side for §1.4.2 */
export default function AccountScreensDemo() {
  return (
    <table width="100%">
      <tbody>
        <tr>
          <td valign="top" width="25%">
            <AccountNavigation />
          </td>
          <td valign="top" width="25%">
            <Signin />
          </td>
          <td valign="top" width="25%">
            <Signup />
          </td>
          <td valign="top" width="25%">
            <Profile />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
