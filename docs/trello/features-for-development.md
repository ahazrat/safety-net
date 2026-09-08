# Features For Development

21 cards.

### Web App

- [Trello card](https://trello.com/c/YY81TUyg)

The web app is accessible from any modern web browser without installation. It provides nearly the same interface as the iOS or Android apps. It may have limited functionality or some missing features, and recommends using the native app for a complete experience.

Concerns

- Web app requires some additional files/setup
- Has its own set of dependencies, so it’s not as simple as just running in web
- A lot of components reusable but requires slightly different code base

**Checklist**

- [ ] Test run web app
- [ ] Identify all known/visible errors with web build
- [ ] Install web dependencies
- [ ] Add conditional logic to components based on platform compatibilities
- [ ] Run web app locally
- [ ] Resolve web app bugs
- [ ] Bundle web app for production deployment
- [ ] Deploy web app to Cloud Storage
- [ ] Add link to web app to LinkedIn Org
- [ ] Containerize App for Deployment


### Django API

- labels: Backlog
- [Trello card](https://trello.com/c/FZaTMm5w)

- Tutorial pt 2:[https://docs.djangoproject.com/en/4.2/intro/tutorial02/](https://docs.djangoproject.com/en/4.2/intro/tutorial02/ "smartCard-inline")
- Database Settings: [https://docs.djangoproject.com/en/4.2/ref/settings/#databases](https://docs.djangoproject.com/en/4.2/ref/settings/#databases "smartCard-inline")
- Using a custom user model when starting a project: [https://docs.djangoproject.com/en/4.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project](https://docs.djangoproject.com/en/4.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project "smartCard-inline")
- Authenticating users: [https://docs.djangoproject.com/en/4.2/topics/auth/default/](https://docs.djangoproject.com/en/4.2/topics/auth/default/ "smartCard-inline")
- repo
  - [https://github.com/TheSafetyNet/sn-django/tree/main](https://github.com/TheSafetyNet/sn-django/tree/main "smartCard-inline")
- build/deploy history
  - [https://console.cloud.google.com/cloud-build/builds;region=us-central1?project=safety-net-398016](https://console.cloud.google.com/cloud-build/builds;region=us-central1?project=safety-net-398016 "‌")
- db
  - safetynet-postgresql
  - [https://console.cloud.google.com/sql/instances/safetynet-postgresql/overview?cloudshell=false&project=safety-net-398016](https://console.cloud.google.com/sql/instances/safetynet-postgresql/overview?cloudshell=false&project=safety-net-398016 "‌")

**Checklist**

- [x] start db
- [x] start local django app
- [x] deploy app
- [x] connect to db from local
- [x] connect to db from local app
- [ ] fix failing deployment
- [ ] connect to db from deployed app


### Radio Scanner Data Feed

- [Trello card](https://trello.com/c/s38CTILs)

**Checklist**

- [ ] catalogue radio scanner feeds available
- [ ] stream radio scanner audio into map features


### Use faker data

- [Trello card](https://trello.com/c/BOwy5Vr4)

[https://faker.readthedocs.io/en/master/](https://faker.readthedocs.io/en/master/ "smartCard-inline")

[https://fakerjs.dev/](https://fakerjs.dev/ "smartCard-inline")

Instead of manually creating JSON files with source data like:

![image.png](https://trello.com/1/cards/651f23f43c097c9f13d071e3/attachments/651f2419cdfb51978df12a06/download/image.png)

Use only data in Firebase. If we need more data in Firebase, create a function that generates faker data when invoked. Attach the function to a UI button to manually create objects when needed.


### Agents and Agencies

- [Trello card](https://trello.com/c/aav68UhU)


### Property

- [Trello card](https://trello.com/c/6KgJKGDR)

- Identify a specific good or property
  - Qualitative + Quantitative
  - Geo-bounded
- Attach an owner
  - as of date
  - until date
- Allow for the transference of ownership
  - Record the listed and executed price
  - Maintain a history of ownership


### Real World Assets

- [Trello card](https://trello.com/c/taWWBFWB)

- Building
- Fence
- Vehicle
- Camera


### Event

- [Trello card](https://trello.com/c/oqjyz4FS)


### Insurance Contract

- [Trello card](https://trello.com/c/w1t7KhkW)

- Insurer
  - Collects premiums
  - Holds reserves
  - Pays benefits for designated events
- Insured
  - Pays premiums
  - Receives ‘coverage’ against risk
  - Receives benefits for event
- Coverage
  - Time range
  - Geo-bounded
  - Idenified Property
  - Designated Event


### Agressor

- [Trello card](https://trello.com/c/MvhYvjSe)


### Domain name

- [Trello card](https://trello.com/c/PkPKu1LY)

[safety-net.us](http://safety-net.us "‌")


### Database Checksum

- [Trello card](https://trello.com/c/RqZzlwtd)


### Auto Versioning: 202304

- [Trello card](https://trello.com/c/pIxce1ak)


### CI/CD

- [Trello card](https://trello.com/c/P1xdyNbf)


### Maps

- [Trello card](https://trello.com/c/WGbJl9po)


### Nginx

- [Trello card](https://trello.com/c/10YG2nQ0)


### Redis

- [Trello card](https://trello.com/c/UtvpHic7)


### Android App

- [Trello card](https://trello.com/c/KeGh9pjQ)


### iOS App

- [Trello card](https://trello.com/c/mo6QGOhR)


### Title Plant

- labels: blue
- [Trello card](https://trello.com/c/pCEeYgSF)

Public records, or title records, contain a **history of every parcel** of real estate in the county, including names of previous owners, liens, easements, and other encumbrances that have been recorded.

Recorded title documents include:

- Deeds
- Mortgages
- Liens
- Easements
- Sale contracts

The County Recorder's Office, or other similarly named office, maintains the title records. These entities need to be identified and stored in a table.

**Chain of Title**

Chain of title refers to the succession of property owners of record dating back to the original grant of title from the state to a private party. If there is a missing link in the chronology of owners, or if there was a defective conveyance, the chain is said to be broken, resulting in a clouded title to the property. To remove the cloud, an owner may need to initiate a suit to quiet title, which clears the title record of any unrecorded claims.

**Abstract of Title**

An abstract of title is a written, chronological summary of the property's title records, and other public records affecting rights and interests in the property. It includes the property's chain of title and all current recorded liens and encumbrances, by date of filing. A title abstractor or title company analyst conducts the search of public records, called a title search, needed to produce an abstract. Insurers and lenders generally require the search to identify title defects and ascertain the current status of encumbrances.

Each state prescribes procedures and requirements for recording in public title records: forms, proper execution, acknowledgment, and witnessing

A **title plant** is a duplicate set of records of a property copied from public records and maintained by a private company, such as a title company.

This can be purchased from the various counties. A **serverless function** should be scheduled to retrieve the **recorder files** and save to cloud storage.

**Development**

- [ ] Create table of title recorder offices
- [ ] Create a base cloud function
- [ ] Download title records
- [ ] Save records to storage
- [ ] Send notification


### SN MLS

- [Trello card](https://trello.com/c/I3y1o3wl)

- Property Scraper
- Property Database
- Listing Database
- Auto-Realtor
- Auto-Assessor
- Auto-ROI
