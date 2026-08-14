# Aroeira Tour Hub

Build a modern, premium, mobile-first web app for our annual golf trip called “2027 Golf Tour - Aroeira, Portugal”.

The site should feel like a luxury Ryder Cup experience rather than a standard website. Think dark theme, subtle animations, glassmorphism cards, drone photography, leaderboard graphics and a premium sporting aesthetic.

Overall Design

Full screen hero image of Aroeira Golf Resort at sunrise.

Dark green, black and gold colour palette.

Modern typography.

Smooth scrolling.

Animated score cards.

Mobile first but looks fantastic on desktop.

Use high quality images throughout.

Icons from Lucide.

Build using React + Tailwind.



HERO SECTION

Display:

2027 Golf Tour

Aroeira, Lisbon, Portugal

1st - 4th June 2027

Large live countdown timer:

Days

Hours

Minutes

Seconds

Include a CTA button:

“View Leaderboard”

Hero background should rotate between professional images of:

Aroeira Lisbon Hotel

Aroeira Pines Classic

Aroeira Challenge Course

Resort clubhouse

Swimming pool

Evening hotel terrace



WEATHER

Add a live weather card showing:

Current weather

5 day forecast

Wind speed

Rain probability

Sunrise

Sunset

Automatically update from a weather API.



ACCOMMODATION

Display beautiful cards showing:

Aroeira Lisbon Hotel

Bedrooms

Pool

Restaurant

Bar

Spa

Gym

Map location

Google Maps button

Include image gallery.



GOLF COURSES

Two premium cards:

Aroeira Pines Classic

Images

Course rating

Slope

Yardage

Interactive hole map

Download scorecard

Hole flyovers (if available)

Aroeira Challenge Course

Same layout.

TRIP AGENDA

Create a premium interactive timeline with icons, times and subtle animations. Each day should be displayed as a separate card with collapsible details.

Tuesday 1st June 2027 – Arrival & Round 1

✈️ 06:00 – Flight from London Heathrow to Lisbon

🚌 Private transfer to Aroeira Lisbon Hotel

🏨 Hotel check-in

⛳ 14:00 – Round 1 – PGA Aroeira No. 1

🍻 Post-round drinks

🍽️ Group dinner

🌃 Night out



Wednesday 2nd June 2027 – Round 2

🍳 Breakfast

⛳ 10:00 – Round 2 – PGA Aroeira No. 2

🍻 Drinks after golf

🍽️ Dinner

🚖 Evening in Lisbon city centre for bars and nightlife



Thursday 3rd June 2027 – Final Round

🍳 Breakfast

🚽 Traditional inspection of Percy’s bidet (display as a humorous turd that can be hidden or shown with a click)

⛳ 11:00 – Round 3 – PGA Aroeira No. 1

🍻 Drinks

🍽️ Final group dinner

🌃 Closing night out



Friday 4th June 2027 – Departure

🍳 Breakfast

☕ Free morning at the hotel

🧳 Check out

🚌 Transfer to Lisbon Airport

✈️ 16:00 – Return flight to London Heathrow

TEAM DRAW

Create a dedicated “Draw Night” section.

Allow captain names to be selected.

Automatically generate:

Teams

Pairs

Fourballs

Matchplay fixtures

Random draw button

Manual override

Display fixtures beautifully.



LIVE LEADERBOARD

Premium Ryder Cup style leaderboard.

Columns:

Position

Player

Stableford Points

Gross

Nett

Birdies

Pars

Current Hole

Total

Highlight Top 3.

Gold

Silver

Bronze

Update automatically as scores are entered.



ENTER SCORES

Create a simple scoring interface.

Select:

Player

Hole

Gross Score

Automatically calculate:

Stableford

Running Total

Daily Leaderboard

Overall Leaderboard

Best Front 9

Best Back 9

Nearest the Pin winners

Long Drive winner



SCORECARDS

Interactive scorecards for every player.

Show:

Hole

Par

Stroke Index

Gross

Stableford

Running Total

Export as PDF.



COURSE MAPS

Include interactive course maps.

Each hole opens individually.

Display:

Hole image

Distance

Hazards

Green layout

Tips



PHOTO GALLERY

Create a gallery for:

Previous golf trips

2027 trip photos

Ability to upload images.

Lightbox viewing.



STATS

Show:

Longest Drive

Most Birdies

Most Pars

Average Stableford

Lowest Gross

Lowest Nett

Best Round

Most Improved

Putting Average

Fairways Hit

Greens in Regulation



PLAYERS

Create player profile cards with:

Photo

Handicap

Handicap Index

Driving Distance

Previous Wins

Ryder Cup Record

Favourite Club

Current Form



ADMIN MODE

Password protected admin area where organisers can:

Edit itinerary

Edit players

Edit handicaps

Edit tee times

Enter scores

Upload images

Change weather location

Update agenda

Manage teams



TECHNICAL REQUIREMENTS

Build using:

React

Tailwind CSS

TypeScript

Framer Motion animations

Supabase backend

Responsive design

PWA support (installable on iPhone and Android)

Dark mode

Fast loading

Local storage plus Supabase sync

The homepage should feel like an interactive tournament hub that everyone in our group can bookmark and check throughout the trip. It should look polished enough that it could pass for an official DP World Tour event website, with smooth animations, premium imagery, live leaderboards, editable tournament management tools, and a focus on excitement, competition, and ease of use.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aroeira-tour-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f3edd378-46bc-483e-9324-4fa8fbd16718).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
