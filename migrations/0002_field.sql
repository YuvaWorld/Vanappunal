-- Personal field journal: journeys and places owned by the signed-in walker.
-- Public pages read every row; writes are always scoped to user_id.

create table if not exists field_journeys (
  id              text primary key,
  user_id         text not null,
  slug            text not null unique,
  title           text not null,
  region          text not null,
  year            text not null,
  dates           text not null default '',
  location        text not null default '',
  summary         text not null default '',
  body            text not null default '[]',
  stats           text not null default '[]',
  adventure_slugs text not null default '[]',
  images          text not null default '[]',
  featured        boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists field_journeys_user_id_idx on field_journeys (user_id);
create index if not exists field_journeys_created_idx on field_journeys (created_at desc);

create table if not exists field_places (
  id           text primary key,
  user_id      text not null,
  name         text not null,
  country      text not null default '',
  region       text not null,
  year         text not null default '',
  note         text not null default '',
  journey_slug text,
  images       text not null default '[]',
  created_at   timestamptz not null default now()
);

create index if not exists field_places_user_id_idx on field_places (user_id);
create index if not exists field_places_journey_idx on field_places (journey_slug);
