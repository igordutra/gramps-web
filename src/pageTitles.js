/*
Page titles

The title of each page in the app, used for the document title and for the
page's level-one heading. Keeping the two in step means a screen reader
announces the same name the browser tab shows.
*/

export const PAGE_TITLES = {
  home: 'Home',
  blog: 'Blog',
  people: 'People',
  families: 'Families',
  events: 'Events',
  places: 'Places',
  sources: 'Sources',
  citations: 'Citations',
  repositories: 'Repositories',
  notes: 'Notes',
  media: 'Media',
  medialist: 'Media',
  map: 'Map',
  tree: 'Family Tree',
  timeline: 'Timeline',
  'dna-matches': 'DNA',
  'dna-chromosome': 'DNA',
  ydna: 'DNA',
  chat: 'Assistant',
  recent: 'History',
  bookmarks: '_Bookmarks',
  tasks: 'Tasks',
  notifications: 'Notifications',
  tags: 'Tags',
  export: 'Export',
  reports: '_Reports',
  report: '_Reports',
  revisions: 'Revisions',
  revision: 'Revisions',
  search: 'Search',
  settings: 'Settings',
  anniversaries: 'Anniversaries',
  // The object-creation forms. Without a title here, the view's own
  // heading helper returns nothing, and the page has no level-one
  // heading at all: the only <h1> on the page belongs to the
  // dashboard, which is inactive and hidden from assistive technology.
  new_person: 'New Person',
  new_family: 'New Family',
  new_event: 'New Event',
  new_place: 'New Place',
  new_citation: 'New Citation',
  new_source: 'New Source',
  new_media: 'New Media',
  new_note: 'New Note',
  new_task: 'New Task',
  new_repository: 'New Repository',
  new_blog_post: 'New Blog Post',
}
