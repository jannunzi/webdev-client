/** Section 1.3.4 — Quiz grades table with Q1–Q3 */
export default function Tables() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>
      <div id="wd-tables">
        <h4>Table Tag</h4>
        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Quiz</th>
              <th align="center">Topic</th>
              <th align="center">Date</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td align="center">HTML</td>
              <td align="center">2/3/21</td>
              <td align="right">85</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td align="center">CSS</td>
              <td align="center">2/10/21</td>
              <td align="right">90</td>
            </tr>
            <tr>
              <td>Q3</td>
              <td align="center">JavaScript</td>
              <td align="center">2/17/21</td>
              <td align="right">95</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Average</td>
              <td align="right">90</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
