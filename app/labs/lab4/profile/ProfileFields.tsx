import {
  dateToHtml,
  htmlToDate,
  TOPICS,
  type Profile,
  type ProfileChanges,
  type ProfileErrors,
  type Role,
} from "./profile";

const input = "block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5";
const error = "text-sm text-red-600";

export default function ProfileFields({
  prefix,
  profile,
  errors,
  update,
}: {
  prefix: string;
  profile: Profile;
  errors: ProfileErrors;
  update: (changes: ProfileChanges) => void;
}) {
  const toggleTopic = (topic: string) =>
    update({
      topics: profile.topics.includes(topic)
        ? profile.topics.filter((t) => t !== topic)
        : [...profile.topics, topic],
    });
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`${prefix}-first-name`}>First name</label>
      <input
        id={`${prefix}-first-name`}
        className={input}
        value={profile.firstName}
        onChange={(e) => update({ firstName: e.target.value })}
      />
      {errors.firstName && <p className={error}>{errors.firstName}</p>}

      <label htmlFor={`${prefix}-last-name`}>Last name</label>
      <input
        id={`${prefix}-last-name`}
        className={input}
        value={profile.lastName}
        onChange={(e) => update({ lastName: e.target.value })}
      />
      {errors.lastName && <p className={error}>{errors.lastName}</p>}

      <label htmlFor={`${prefix}-password`}>Password</label>
      <input
        id={`${prefix}-password`}
        type="password"
        className={input}
        value={profile.password}
        onChange={(e) => update({ password: e.target.value })}
      />
      {errors.password && <p className={error}>{errors.password}</p>}

      <label htmlFor={`${prefix}-dob`}>Date of birth</label>
      <input
        id={`${prefix}-dob`}
        type="date"
        className={input}
        value={dateToHtml(profile.dob)}
        onChange={(e) => update({ dob: htmlToDate(e.target.value) })}
      />
      {errors.dob && <p className={error}>{errors.dob}</p>}

      <label htmlFor={`${prefix}-role`}>Role</label>
      <select
        id={`${prefix}-role`}
        className={input}
        value={profile.role}
        onChange={(e) => update({ role: e.target.value as Role })}
      >
        <option value="">Choose a role</option>
        <option value="STUDENT">Student</option>
        <option value="TA">Teaching assistant</option>
        <option value="FACULTY">Faculty</option>
      </select>
      {errors.role && <p className={error}>{errors.role}</p>}

      <label className="flex items-center gap-2">
        <input
          id={`${prefix}-newsletter`}
          type="checkbox"
          checked={profile.newsletter}
          onChange={() => update({ newsletter: !profile.newsletter })}
        />
        Email me the newsletter
      </label>

      <fieldset id={`${prefix}-topics`}>
        <legend>Topics</legend>
        {TOPICS.map((topic) => (
          <label key={topic} className="mr-4 inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={profile.topics.includes(topic)}
              onChange={() => toggleTopic(topic)}
            />
            {topic}
          </label>
        ))}
      </fieldset>
      {errors.topics && <p className={error}>{errors.topics}</p>}

      <fieldset id={`${prefix}-theme`}>
        <legend>Theme</legend>
        <label className="mr-4 inline-flex items-center gap-1">
          <input
            type="radio"
            name={`${prefix}-theme`}
            checked={profile.theme === "light"}
            onChange={() => update({ theme: "light" })}
          />
          Light
        </label>
        <label className="inline-flex items-center gap-1">
          <input
            type="radio"
            name={`${prefix}-theme`}
            checked={profile.theme === "dark"}
            onChange={() => update({ theme: "dark" })}
          />
          Dark
        </label>
      </fieldset>
    </div>
  );
}
