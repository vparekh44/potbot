create table "users" (
  id uuid primary key not null,
  wallet_address text not null unique,
  nonce text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "profiles" (
    id uuid primary key not null,
    user_id uuid not null unique references "user" (id) on delete cascade,
    name text not null,
    bio text,
    image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "discord_integrations" (
    id uuid primary key not null,
    user_id uuid not null references "user" (id) on delete cascade,
    discord_id number not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "reactions" (
    id uuid primary key not null,
    sender_id number not null,
    receiver_id number not null,
    emoji text not null,
    server_id number not null,
    message_id number not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);