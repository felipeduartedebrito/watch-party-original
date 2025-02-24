## Immidee Watch Party Project

In this takehome project, we want to understand your:

- ability to build non-trivial unit/e2e tests
- comfort picking up unfamiliar technologies
- architectural decisions, abstractions, and rigor

We want to respect your time, so please try not to spend more than 5 hours on this. We know that this is a challenging task & you are under time pressure and will keep that in mind when evaluating your solution.

### Instructions

- Create a firestore database https://console.firebase.google.com
- Create the .env file and update the FIREBASE_CONFIG data
- Run the app simply "npm i" and then "npm dev"

### Problem

This is a collaborative “Watch Party” app that lets a distributed group of users watch youtube videos together. The frontend is written in Typescript. The app has two main pages:

- `/create` **Create a new session**
  - by giving it a name and a youtube video link. After creating a session `ABC`, you should be automatically redirected to the page `/watch` page for that session
- `/watch/:sessionId` **Join an existing session**
  _⚠️ The player must be **synced for all users at all times** no matter when they join the party_
  - **Playing/pausing/seek** the video. When someone plays/pauses the video or jumps to a certain time in the video, this should update for everyone in the session
  - **Late to the party**... Everything should stay synced if a user joins the session late (e.g. if the video was already playing, the new user should see it playing at the correct time)

### Assumptions

- This app obviously **doesn’t need to be production-ready**, but you should at least be aware of any issues you may encounter in more real-world scenarios.
- We gave you all of the frontend UX you’ll need, including skeleton pages for the `create` and `watch` routes, so you can focus on implementing the unit-testing logic for the app.
- All components are in the main route "./routes/\_index.tsx", we expect you to create the missing routes and move/update the components accordingly
- In case you face any missing functionality we expect you to create a test together with the solution

### Required Unit Tests

- [ ] **Creating a session**. Any user should be able to create a session to watch a given Youtube video.
- [ ] **Joining a session**. Any user should be able to join a session created by another user using the shareable session link.
- [ ] **Playing/pausing** the video. When a participant pauses the video, it should pause for everyone. When a participant plays the video, it should start playing for everyone.
- [ ] **“Seek”**. When someone jumps to a certain time in the video it should jump to that time for everyone.
- [ ] **Late to the party**... Everything should stay synced even if a user joins the watch party late (e.g. the video is already playing)
- [ ] **Player controls.** All the player controls (e.g. play, pause, and seek) should be intuitive and behave as expected.

🚨 **Please fill out the rubric in the README with the functionality you were able to complete**

### Architecture Questions

After building the watch party app, we would like you to answer the following questions about design decisions and tradeoffs you made while building it. Please fill them out in the README along with your submission.

1. **How do you guarantee that the time that a new user joins is accurate (i.e perfectly in sync with the other users in the session) and are there any edge cases where it isn’t? Think about cases that might occur with real production traffic.**

I used a timestamp method. When a new user join the session, the server provides the timestamp of the video playing. There are a few situations where synchronization may not be accurate. For example, network latency fluctuations can cause variations in the accuracy of the timestamp received by the new user. Server congestion during periods of high load can cause delays in distributing timestamps and synchronization messages. Additionally, users in different time zones may experience varied response times, affecting the accuracy of synchronization.

2. **Are there any other situations - i.e race conditions, edge cases - where one user can be out of sync with another? (Out of sync meaning that user A has the video playing or paused at some time, while user B has the video playing or paused at some other time.)**

In terms of situations and race conditions where a user might get out of sync, common cases include simultaneous play/pause actions. If two or more users click the play or pause buttons at the same time, there may be a race condition resulting in desynchronization. Lost network messages due to connectivity issues can also cause desynchronization, as a user may miss a crucial synchronization message. Additionally, asynchronous server updates can cause issues, especially if the server does not apply playback time updates atomically, resulting in different clients receiving slightly different timestamps.

3. **How would you productionize this application to a scale where it needs to be used reliably with 1M+ DAUs and 10k people connected to a single session? Think infrastructure changes, code changes & UX changes.**

To make this app work for a lot of people, like over a million daily users and thousands in one session, we need to make some changes. We can use multiple servers to share the load so no single server gets overwhelmed. Using a distributed cache like Redis helps in quickly storing and retrieving data. We should also build the system to handle failures gracefully, so it continues to work even if something goes wrong. For the user experience, we can add visual indicators to show if they are in sync with others or if there's a delay. Giving real-time feedback about network status can help users understand any issues.

### Help & Clarifications

Feel free to use any resource on the Internet to help you tackle this challenge better: guides, technical documentation, sample projects on Github — anything is fair game! We want to see how you can build things in a real working environment where no information is off limits.

### Submission

When you’ve finished, please send back your results to the team via email (team@immidee.tech) as a **zip file**. Make sure to include any instructions about how to run the app in the README.md.
