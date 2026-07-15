// Placeholder data only — Day 4 replaces every usage of this file with
// real responses from GET /api/tickets. Kept separate so it's obvious
// what's mock vs. what's wired to the backend.

export const initialMockTickets = [
  {
    _id: 'mock-1',
    title: "Laptop won't power on",
    description:
      'Held power button for 30s, no lights, tried a different outlet and cable.',
    priority: 'High',
    status: 'Open',
    createdBy: { name: 'Alex Employee', email: 'employee@deskflow.io' },
    createdAt: '2026-07-10T09:15:00.000Z',
  },
  {
    _id: 'mock-2',
    title: 'VPN keeps dropping mid-call',
    description:
      'Disconnects roughly every 20 minutes during video calls, reconnects on its own after a few seconds.',
    priority: 'Medium',
    status: 'In Progress',
    createdBy: { name: 'Alex Employee', email: 'employee@deskflow.io' },
    createdAt: '2026-07-08T13:40:00.000Z',
  },
  {
    _id: 'mock-3',
    title: 'Need Figma license activated',
    description: 'New design hire starts Monday and still shows as unlicensed in the admin console.',
    priority: 'Low',
    status: 'Resolved',
    createdBy: { name: 'Priya Naidu', email: 'priya.n@deskflow.io' },
    createdAt: '2026-07-05T11:00:00.000Z',
  },
  {
    _id: 'mock-4',
    title: 'Printer on 3rd floor jammed',
    description: 'Paper jam error persists after clearing the tray twice, printer light flashing orange.',
    priority: 'Medium',
    status: 'Open',
    createdBy: { name: 'Thabo Mokoena', email: 'thabo.m@deskflow.io' },
    createdAt: '2026-07-11T08:05:00.000Z',
  },
]
