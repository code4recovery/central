export const strings = {
  about: "About this software",
  account: {
    description: "Settings apply to all account users.",
    name: "Service entity name",
    name_description: "Used in emails",
    notFound: "Could not find account.",
    switched: "Switched account to {name}",
    theme: "Color theme",
    title: "Account Settings",
    updated: "Account updated.",
    url: "Meeting finder URL",
    url_description: "Used to generate meeting view links",
    url_placeholder: "https://example.org/meetings",
  },
  activity: {
    empty: "No activity yet",
    approve: "Approve this change",
    decline: "Decline this change",
    general: {
      add: "Added representative",
      approved: "Approved",
      archive: "Archived",
      create: "Created",
      editUser: "Edited representative",
      remove: "Removed representative",
      requestGroupUpdate: "Requested updated {properties} {approved}",
      unarchive: "Unarchived",
      update: "Updated {properties}",
    },
    group: {
      add: "Added group representative",
      archive: "Archived group",
      create: "Created group",
      editUser: "Edited group representative",
      remove: "Removed group representative",
      requestGroupUpdate: "Requested group info update",
      unarchive: "Unarchived group",
      update: "Updated {properties}",
    },
    meeting: {
      archive: "Archived meeting",
      create: "Created meeting",
      unarchive: "Unarchived meeting",
      update: "Updated {properties}",
    },
    name: "Name",
    revert: "Revert this change",
    title: "Activity",
    what: "What",
    when: "When",
    who: "Who",
  },
  app_name: "Central",
  auth: {
    email_sent:
      "Now check your email. If you have an account, you will receive an email with a link to log in.",
    expired: "That link has expired, please try again.",
    submit: "Sign in",
    title: "Sign in to your account",
    out: "Sign out",
  },
  cancel: "Cancel",
  created: "Created",
  days: {
    friday: "Friday",
    monday: "Monday",
    saturday: "Saturday",
    sunday: "Sunday",
    thursday: "Thursday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
  },
  email: {
    footer:
      "This email was sent by {app} on behalf of {accountName}. If you didn’t request it, there’s nothing to worry about — you can safely ignore it.",
    invite: {
      buttonText: "Accept invitation",
      headline:
        "You have been invited to help administer the listings on our website at {accountUrl}.",
      instructions: "Tap the button below to accept:",
      subject: "Welcome to {accountName}",
    },
    login: {
      buttonText: "Confirm email",
      headline:
        "Once you’ve confirmed that {email} is your email address, you’ll be logged in to the site.",
      instructions: "Tap the button below to confirm:",
      subject: "Confirm your email address to log in",
    },
    request: {
      buttonText: "Approve request",
      headline:
        "{name} has requested to be added as a group representative for {group}.",
      instructions: "Tap the button below to approve:",
      subject: "Request to add group representative",
    },
    request_approved: {
      buttonText: "Continue your request",
      headline: "You've been added to {group}.",
      instructions: "You can now continue your request at the link below.",
      subject: "You've been added!",
    },
    update_applied: {
      buttonText: "View your meetings",
      headline: "Your group listing update has now been applied to {group}.",
      instructions: "Tap the button below to view your group listing.",
      subject: "Group listing update complete",
    },
  },
  error: "Error",
  error_unknown: "An unknown error occurred.",
  feedback: {
    title: "Feedback",
    empty: "No feedback received yet",
  },
  form: {
    invalidConferenceProvider: "Conference provider is not supported",
    invalidConferenceUrl: "The conference URL is incomplete",
    invalidEmail: "Invalid email",
    invalidPayPal: "Invalid PayPal.me username, eg 'MyGroupName'",
    invalidPhone:
      "Phone numbers should only contain digits or +,()-# characters",
    invalidSquare: "Cashtags should start with $",
    invalidUrl: "The URL is invalid",
    invalidVenmo: "Venmo handles should start with @",
    required: "Required",
    save: "Save",
    saving: "Saving",
  },
  group: {
    add: "Add group",
    added: "Group has been added",
    description:
      "There are {groupCount} groups and {meetingCount} meetings in your account.",
    edit: "Edit group",
    email: "Email",
    empty: "No groups added yet",
    empty_search: "No groups matched “{search}”",
    name: "Group name",
    notes: "Group notes",
    notFound: "Could not find group.",
    paypal: "PayPal",
    phone: "Phone",
    recordExists: "Record ID already in use",
    recordID: "Record ID",
    square: "Square",
    title: "Groups",
    updated: "Group has been updated",
    userAdded: "Group representative added",
    userEdited: "Group representative edited",
    userRemoved: "Group representative removed",
    venmo: "Venmo",
    website: "Website",
  },
  help: {
    conference_providers: "What makes a good conference URL?",
    conference_providers_content:
      "Conference URLs should be links that the user can click to join the meeting directly. They should be links to widely-recognized services, and should go straight in to the meeting. Other types of URLs should go in the group website field.",
    record_id: "What is a record ID?",
    record_id_content:
      "Record IDs are used to identify groups in Central. They can be any string of letters, numbers, or symbols, but they must be unique within your account. The Record ID suggested here is one number higher than the current max.",
    online_location: "Can online meetings have a location?",
    online_location_content:
      "Yes, online meetings can have approximate locations, such as Philadelphia, PA. These can be thought of as places of origin or affinity for the meeting. Specifying this will also set the meeting timezone.",
    phone_format: "What's the recommended format for Zoom phone numbers?",
    phone_format_content:
      "Ideally the phone number should be in a format that can be dialed directly, such as +12125551212,,123456789#,,#,,444444# -- commas are used to add pauses, and double commas are used to add longer pauses. The commas are optional, but the # symbols are required.",
  },
  json_updated: "JSON updated",
  languages: {
    AM: "Amharic",
    DA: "Danish",
    DE: "German",
    EL: "Greek",
    EN: "English",
    ES: "Spanish",
    FA: "Persian",
    FR: "French",
    HE: "Hebrew",
    HI: "Hindi",
    HR: "Croatian",
    HU: "Hungarian",
    IT: "Italian",
    JA: "Japanese",
    KO: "Korean",
    LT: "Lithuanian",
    ML: "Malayalam",
    PA: "Punjabi",
    PL: "Polish",
    PT: "Portuguese",
    RU: "Russian",
    SK: "Slovak",
    SV: "Swedish",
    TL: "Tagalog",
    UK: "Ukrainian",
  },
  load_more: "Load {count} more",
  loading: "Loading…",
  meetings: {
    add: "Add meeting",
    apply_changes: "Apply changes to:",
    apply_changes_all: "all group meetings",
    apply_changes_only_this: "only this meeting",
    apply_changes_same_time: "all group meetings at this time",
    archive: "Archive",
    archiving: "Archiving",
    archived: "Archived",
    conference_phone: "Conference phone",
    conference_phone_help: "Phone number to join the meeting",
    conference_phone_notes: "Conference phone notes",
    conference_phone_notes_help: "Numeric password",
    conference_url: "Conference URL",
    conference_url_help: "URL to join the meeting",
    conference_url_notes: "Conference URL notes",
    conference_url_notes_help: "Meeting ID and password, if any",
    day: "Day",
    description: "There are {meetingCount} meetings in your account.",
    duplicate: "Duplicate",
    duration: "Duration",
    edit: "Edit meeting",
    empty: "No meetings added yet",
    empty_search: "No meetings matched {search}",
    geocode: "Location",
    geocode_help:
      "Online meetings can have approximate locations, eg neighborhood, city, state/province",
    languages: "Languages",
    location: "Location name",
    location_help: "Building name (optional)",
    location_notes: "Location notes",
    location_notes_help: "Additional location info",
    name: "Meeting name",
    notes: "Meeting notes",
    notes_notes: "Avoid adding information here that could go in other fields",
    notFound: "Could not find meeting.",
    ongoing: "Ongoing",
    time: "Time",
    unarchive: "Unarchive",
    unarchiving: "Unarchiving",
    timezone: "Timezone",
    title: "Meetings",
    types: "Types",
    view: "View",
    when: "When",
  },
  no: "No",
  no_updates: "Nothing was updated.",
  pending: "Pending",
  reports: {
    archived: {
      description: "{count} meetings have been archived.",
      empty: "No archived meetings yet.",
      title: "Archived",
    },
    downloadContacts: {
      title: "Download contacts",
    },
    empty: "No reports yet",
    new_groups: {
      description: "{count} groups were added in the last week.",
      empty: "No groups have been added in the last week.",
      title: "New Groups",
    },
    new_meetings: {
      description: "{count} meetings were added in the last week.",
      empty: "No meetings have been added in the last week.",
      title: "New Meetings",
    },
    title: "Reports",
  },
  representatives: {
    empty: "No representatives yet",
    title: "Representatives",
    warning: "Editing this information will edit the user's profile.",
    warning_groups:
      "Editing this information will edit the user's profile. This user also represents: {groups}.",
  },
  request: {
    agree: "By clicking below I agree to the Online Intergroup of A.A.:",
    approved: "Request approved ✅",
    approved_description: "{user} has been added to {group}.",
    directory_guidelines: "Directory Guidelines",
    edit_request_sent:
      "Thank you. Your request has been sent to the site administrators. You will receive an email when your request is confirmed.",
    email_sent:
      "Thanks! Now check your email. You will receive a link to confirm your identity.",
    group_info: {
      description:
        "Now tell us about your group. This information will be included on each meeting listing.",
      email: "Group email, if any",
      email_help:
        "Optional group email address. This will be displayed publicly on the meeting listing.",
      email_placeholder: "group.name@email.com",
      name: "Group name",
      notes: "Group notes",
      notes_help:
        "Please keep this short - it should be general information about the group and not make reference to individual meetings (that comes next).",
      phone: "Group phone, if any",
      phone_help:
        "Optional group phone number. This will be displayed publicly on the meeting listing.",
      title: "Group info",
      website: "Group website, if any",
      website_help:
        "Optional link to your group website. If your group does not have a website, leave this blank. Should not be a link to a meeting, that comes next.",
    },
    group_select: {
      buttonText: "Request to be added",
      buttonTextHelp:
        "This will send a request on your behalf to current group representatives.",
      description:
        "Groups are responsible for meeting listings on the website. New groups are vetted by the Policy and Admissions Committee.",
      new_group: "New Group",
      no_results: "No results",
      search: "Get added to an existing group",
      searching: "Searching…",
      title: "Group selection",
      your_name: "Your name",
      your_name_help:
        "Your name will be seen by the other members of your group.",
    },
    login: {
      buttonText: "Confirm your identity",
      description:
        "Please start by confirming your identity. We will keep your contact info confidential.",
      email: "Your email address",
      title: "Hi there 👋",
    },
    meeting: {
      active: "This meeting is active",
      conference_phone: "Conference phone",
      conference_phone_help:
        "Should be a phone number to join a meeting, and not contain letters.",
      conference_phone_notes: "Notes",
      conference_url: "Conference URL",
      conference_url_help: "Should be a URL to join a meeting directly.",
      conference_url_notes: "Notes",
      conference_url_notes_placeholder: "Password: 123456789",
      description: "Now tell us about your meetings.",
      duration: "Duration, in minutes",
      languages: "Languages",
      languages_help:
        "Languages that are typically used in the meeting. Most meetings use only one.",
      name: "Meeting name",
      name_help: "Often this will be the same as the group name.",
      notes: "Meeting notes",
      notes_help:
        "Please keep this short - no need to repeat information captured elsewhere, such as the meeting times or conference URL.",
      time: "Start time",
      time_help:
        "Leave these fields blank if the meeting is an 'ongoing' meeting, such as an email group or forum.",
      timezone: "Timezone",
      title: "Meetings",
      types: "Types",
      types_help:
        "Should represent the actual focus of the meeting. Please check a maximum of five.",
    },
    meeting_select: {
      description:
        "No need to select anything here if you're only editing group info.",
      new_meeting: "New Meeting",
      title: "Meeting selection",
    },
    privacy_policy: "Privacy Policy",
    request_sent:
      "Great! An email has been sent to the current group reps. Once they confirm, you will receive an email to continue.",
    submit: "Submit request",
    title: "New Listings • Changes • Removals",
  },
  requests: {
    empty: "Inbox zero! There are no pending requests.",
    title: "Requests",
    title_full: "Pending requests",
  },
  search: {
    description_many: "{meetingCount} results match “{search}”",
    description_none: "No results match “{search}”",
    description_one: "One result matches “{search}”",
    placeholder: "Search",
    title: "Search Results",
  },
  types: {
    "11": "11th Step Meditation",
    "12x12": "12 Steps & 12 Traditions",
    "AL-AN": "Concurrent with Al-Anon",
    "BV-I": "Blind / Visually Impaired",
    "D-HOH": "Deaf / Hard of Hearing",
    A: "Secular",
    ABSI: "As Bill Sees It",
    AL: "Concurrent with Alateen",
    ASL: "American Sign Language",
    B: "Big Book",
    BA: "Babysitting Available",
    BE: "Newcomer",
    BI: "Bisexual",
    BRK: "Breakfast",
    C: "Closed",
    CAN: "Candlelight",
    CF: "Child-Friendly",
    D: "Discussion",
    DB: "Digital Basket",
    DD: "Dual Diagnosis",
    DR: "Daily Reflections",
    FF: "Fragrance Free",
    G: "Gay",
    GR: "Grapevine",
    H: "Birthday",
    L: "Lesbian",
    LGBTQ: "LGBTQIAA+",
    LIT: "Literature",
    LS: "Living Sober",
    "LO-I": "Loners / Isolationists",
    M: "Men",
    MED: "Meditation",
    N: "Native American",
    NDG: "Indigenous",
    O: "Open",
    OUT: "Outdoor",
    P: "Professionals",
    POA: "Proof of Attendance",
    POC: "People of Color",
    RSL: "Russian Sign Language",
    SEN: "Seniors",
    SM: "Smoking Permitted",
    SP: "Speaker",
    ST: "Step Study",
    T: "Transgender",
    TC: "Location Temporarily Closed",
    TR: "Tradition Study",
    W: "Women",
    X: "Wheelchair Access",
    XB: "Wheelchair-Accessible Bathroom",
    XT: "Cross Talk Permitted",
    Y: "Young People",
  },
  updated: "Updated",
  users: {
    add: "Add User",
    add_description: "New users will receive an email to log in.",
    added: "User has been added",
    admin: "Admin",
    admin_description:
      "This user may add, edit, and remove other users, and adjust account settings.",
    edit: "Edit User",
    edit_description:
      "Avatars are associated with email and can be updated at Gravatar.com",
    edit_profile: "Edit Profile",
    email: "Email address",
    email_description: "Kept private",
    exists: "This user is already added",
    last_seen: "Last Seen",
    last_seen_never: "Never",
    menu_option: "Users",
    name: "Name",
    name_description: "Visible to other users",
    name_placeholder: "Laszlo C.",
    role: "Role",
    title: "Users",
    updated: "User profile updated",
  },
  yes: "Yes",
};
