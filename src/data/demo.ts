import type {
  Client,
  Subscription,
  AvailabilitySlot,
  Booking,
  Message,
  Announcement,
  CoachProfile,
} from '@/types';

export const demoCoachProfile: CoachProfile = {
  id: 'coach-1',
  name: 'Stefania Moraru',
  bio: 'Antrenor personal certificat cu peste 8 ani de experiență în transformarea corpului și a minții. Specializată în antrenament de forță, recompoziție corporală și mobilitate. Filozofia mea este simplă: rezultate sustenabile prin planuri personalizate, disciplină și consecvență.',
  tagline: 'Antrenament personal. Rezultate reale.',
  specialties: [
    'Personal Training',
    'Antrenament de forță',
    'Slăbire și recompoziție',
    'Mobilitate și postură',
    'Pregătire fizică generală',
  ],
  photo: null,
  location: 'București, România',
  email: 'contact@stefaniamoraru.ro',
  phone: '+40 700 000 000',
  instagram: '@stefaniamoraru',
};

export const demoClients: Client[] = [
  { id: 'c1', user_id: null, name: 'Ana Ionescu', email: 'ana@example.com', phone: '0721 111 111', goal: 'Slăbire și recompoziție', notes: 'Disponibilă dimineața', status: 'active', joined_at: '2025-01-15' },
  { id: 'c2', user_id: null, name: 'Mihai Pop', email: 'mihai@example.com', phone: '0722 222 222', goal: 'Antrenament de forță', notes: 'Preferă antrenamentele de seară', status: 'active', joined_at: '2025-02-01' },
  { id: 'c3', user_id: null, name: 'Elena Dumitrescu', email: 'elena@example.com', phone: '0723 333 333', goal: 'Mobilitate și postură', notes: 'Probleme lombare - atenție la squats', status: 'active', joined_at: '2025-03-10' },
  { id: 'c4', user_id: null, name: 'Andrei Georgescu', email: 'andrei@example.com', phone: '0724 444 444', goal: 'Pregătire fizică generală', notes: 'Vrea să revină după pauză lungă', status: 'active', joined_at: '2025-04-20' },
  { id: 'c5', user_id: null, name: 'Maria Radu', email: 'maria@example.com', phone: '0725 555 555', goal: 'Slăbire și recompoziție', notes: 'Motivată, obiectiv 10kg în 3 luni', status: 'active', joined_at: '2025-05-05' },
  { id: 'c6', user_id: null, name: 'Cristian Stoica', email: 'cristian@example.com', phone: '0726 666 666', goal: 'Antrenament de forță', notes: 'Avansat, vrea hipertrofie', status: 'paused', joined_at: '2025-06-12' },
];

export const demoSubscriptions: Subscription[] = [
  { id: 's1', client_id: 'c1', sessions_per_month: 10, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 0, status: 'active' },
  { id: 's2', client_id: 'c2', sessions_per_month: 8, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 0, status: 'active' },
  { id: 's3', client_id: 'c3', sessions_per_month: 12, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 2, status: 'active' },
  { id: 's4', client_id: 'c4', sessions_per_month: 10, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 0, status: 'active' },
  { id: 's5', client_id: 'c5', sessions_per_month: 10, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 0, status: 'active' },
  { id: 's6', client_id: 'c6', sessions_per_month: 8, period_start: '2025-08-01', period_end: '2025-08-31', extension_days: 5, status: 'paused' },
];

function makeDate(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const demoSlots: AvailabilitySlot[] = [
  { id: 'sl1', starts_at: makeDate(0, 8), ends_at: makeDate(0, 9), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl2', starts_at: makeDate(0, 10), ends_at: makeDate(0, 11), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl3', starts_at: makeDate(0, 18), ends_at: makeDate(0, 19), location: 'Studio 2', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl4', starts_at: makeDate(1, 9), ends_at: makeDate(1, 10), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl5', starts_at: makeDate(1, 17), ends_at: makeDate(1, 18), location: 'Studio 2', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl6', starts_at: makeDate(2, 8), ends_at: makeDate(2, 9), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl7', starts_at: makeDate(2, 10), ends_at: makeDate(2, 11), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl8', starts_at: makeDate(3, 9), ends_at: makeDate(3, 10), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl9', starts_at: makeDate(3, 18), ends_at: makeDate(3, 19), location: 'Studio 2', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl10', starts_at: makeDate(4, 8), ends_at: makeDate(4, 9), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl11', starts_at: makeDate(4, 17), ends_at: makeDate(4, 18), location: 'Studio 2', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl12', starts_at: makeDate(5, 9), ends_at: makeDate(5, 10), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl13', starts_at: makeDate(5, 11), ends_at: makeDate(5, 12), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl14', starts_at: makeDate(6, 10), ends_at: makeDate(6, 11), location: 'Studio 1', published: true, bookable_from: makeDate(-7, 0) },
  { id: 'sl15', starts_at: makeDate(7, 8), ends_at: makeDate(7, 9), location: 'Studio 1', published: false, bookable_from: null },
  { id: 'sl16', starts_at: makeDate(7, 10), ends_at: makeDate(7, 11), location: 'Studio 1', published: false, bookable_from: null },
];

export const demoBookings: Booking[] = [
  { id: 'b1', slot_id: 'sl1', client_id: 'c1', status: 'scheduled', consumes_session: true, created_at: makeDate(-3, 12), cancelled_at: null, cancellation_reason: null },
  { id: 'b2', slot_id: 'sl3', client_id: 'c2', status: 'scheduled', consumes_session: true, created_at: makeDate(-3, 13), cancelled_at: null, cancellation_reason: null },
  { id: 'b3', slot_id: 'sl4', client_id: 'c3', status: 'scheduled', consumes_session: true, created_at: makeDate(-2, 10), cancelled_at: null, cancellation_reason: null },
  { id: 'b4', slot_id: 'sl6', client_id: 'c4', status: 'scheduled', consumes_session: true, created_at: makeDate(-2, 14), cancelled_at: null, cancellation_reason: null },
  { id: 'b5', slot_id: 'sl8', client_id: 'c5', status: 'scheduled', consumes_session: true, created_at: makeDate(-1, 9), cancelled_at: null, cancellation_reason: null },
  { id: 'b6', slot_id: 'sl2', client_id: 'c1', status: 'completed', consumes_session: true, created_at: makeDate(-5, 12), cancelled_at: null, cancellation_reason: null },
  { id: 'b7', slot_id: 'sl5', client_id: 'c2', status: 'completed', consumes_session: true, created_at: makeDate(-5, 13), cancelled_at: null, cancellation_reason: null },
  { id: 'b8', slot_id: 'sl7', client_id: 'c3', status: 'completed', consumes_session: true, created_at: makeDate(-4, 10), cancelled_at: null, cancellation_reason: null },
  { id: 'b9', slot_id: 'sl9', client_id: 'c1', status: 'completed', consumes_session: true, created_at: makeDate(-4, 14), cancelled_at: null, cancellation_reason: null },
  { id: 'b10', slot_id: 'sl10', client_id: 'c4', status: 'cancelled', consumes_session: false, created_at: makeDate(-6, 12), cancelled_at: makeDate(-3, 8), cancellation_reason: 'Conflict program' },
  { id: 'b11', slot_id: 'sl11', client_id: 'c5', status: 'no_show', consumes_session: true, created_at: makeDate(-6, 13), cancelled_at: null, cancellation_reason: null },
];

export const demoMessages: Message[] = [
  { id: 'm1', client_id: 'c1', sender: 'coach', body: 'Salut Ana! Mâine avem ședința la 8. Nu uita să te hidratezi bine azi!', read_at: null, created_at: makeDate(-1, 18) },
  { id: 'm2', client_id: 'c1', sender: 'client', body: 'Salut Stefania! Desigur, ne vedem mâine. Mulțumesc!', read_at: makeDate(-1, 19), created_at: makeDate(-1, 19) },
  { id: 'm3', client_id: 'c2', sender: 'coach', body: 'Mihai, data viitoare o să lucrăm picioare. Pregătește-te!', read_at: null, created_at: makeDate(0, 8) },
  { id: 'm4', client_id: 'c3', sender: 'client', body: 'Stefania, am avut dureri lombare săptămâna asta. Putem ajusta programul?', read_at: null, created_at: makeDate(0, 10) },
];

export const demoAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Program de toamnă', body: 'Începem programul de toamnă cu noi provocări! Sloturile pentru septembrie vor fi publicate vineri, 29 august.', published: true, created_at: makeDate(-2, 10) },
  { id: 'a2', title: 'Locație nouă', body: 'Începând cu luna septembrie, o parte din antrenamente vor avea loc la Studio 2, echipat cu echipament nou.', published: true, created_at: makeDate(-5, 12) },
];

export const demoTestimonials = [
  { name: 'Ana I.', result: '-8kg în 3 luni', text: 'Stefania a schimbat complet relația mea cu sportul. Am slăbit 8kg și mă simt mai puternică ca niciodată.', rating: 5 },
  { name: 'Mihai P.', result: '+5kg masă musculară', text: 'Antrenamentele cu Stefania sunt intense, bine structurate și mereu adaptate la obiectivele mele. Recomand 100%.', rating: 5 },
  { name: 'Elena D.', result: 'Mobilitate restaurată', text: 'Am rezolvat problemele lombare cu care mă luptam de ani. Profesionalism și atenție la detalii.', rating: 5 },
  { name: 'Andrei G.', result: 'Revenire după pauză', text: 'M-a ajutat să revin în formă după o pauză de 2 ani. Progres constant, fără accidentări.', rating: 5 },
];

export const demoTransformations = [
  { name: 'Maria R.', period: '3 luni', stat: '-12kg', detail: 'Recompoziție corporală completă' },
  { name: 'Cristian S.', period: '6 luni', stat: '+8kg', detail: 'Hipertrofie și forță' },
  { name: 'Ana I.', period: '4 luni', stat: '-8kg', detail: 'Slăbire și tonifiere' },
  { name: 'Elena D.', period: '2 luni', stat: '0 durere', detail: 'Mobilitate și postură' },
];
