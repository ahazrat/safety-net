# Jacob

5 cards.

### CI/CD

- [Trello card](https://trello.com/c/fiGnIxfC)

Enable automated and convenient pipelines to test, build, and deploy the app

**Tagging suggestions**

It’s common practice to prefix your version names with the letter `v`. Some good tag names might be `v1.0.0` or `v2.3.4`.

If the tag isn’t meant for production use, add a pre-release version after the version name. Some good pre-release versions might be `v0.2.0-alpha` or `v5.9-beta.3`.

Semantic versioning

If you’re new to releasing software, we highly recommend to [learn more about semantic versioning.](http://semver.org/ "‌")

A newly published release will automatically be labeled as the latest release for this repository.

If 'Set as the latest release' is unchecked, the latest release will be determined by higher semantic version and creation date. [Learn more about release settings.](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository "‌")

**Checklist**

- [ ] Create node.js.yml for build pipeline
- [ ] Build and version artifacts
- [ ] Deploy and test public app
- [ ] Use Github Actions with Expo Application Services: https://blog.devops.dev/ci-cd-on-github-for-expo-projects-288c517ff14a


### Cloud Functions

- [Trello card](https://trello.com/c/MPXafouK)

Backend operations as independent function microservices

**Cloud Functions to Create**

- [x] Daily: Count number of documents in each collection, write results to a new 'metrics' collection, where document id is the run timestamp
- [ ] Weekly: Aggregate counts of BQ crime data for quick UI display
- [ ] Monthly: Scrape police district public info (https://www.chicago.gov/city/en/depts/cpd.html)
- [ ] Yearly: Update public districting and base gis info


### Database

- [Trello card](https://trello.com/c/teLp1eVg)

Database schema:[https://docs.google.com/document/d/1TUn45YyYPj2gxSBjbaSV3YAlRnn_QR13fWb0KdNa8O4/edit?usp=sharing](https://docs.google.com/document/d/1TUn45YyYPj2gxSBjbaSV3YAlRnn_QR13fWb0KdNa8O4/edit?usp=sharing "smartCard-inline")

**Checklist**

- [x] Firebase setup and connection
- [x] NoSQL Database schema design
- [x] BigQuery crime data fetching
- [ ] Review database schema design
- [ ] Cache common BQ results to Firebase


### Code Quality

- [Trello card](https://trello.com/c/losmLGGF)

**Checklist**

- [x] ESlint code
- [ ] Remove all errors
- [ ] Remove all warnings
- [x] Setup eslintrc.js and prettierrc.js


### Build

- [Trello card](https://trello.com/c/ui9Y1kAe)

Expo Application Services Documentation:
[https://docs.expo.dev/build/introduction/](https://docs.expo.dev/build/introduction/ "smartCard-inline")

**Checklist**

- [x] Test Expo Application Services (EAS) Android Build
- [ ] Test Expo Application Services iOS Build
- [ ] Export build artifact for App Store submission
- [ ] Export build artifact for Play Store submission
