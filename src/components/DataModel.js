module.exports = mongoose => mongoose.model(
    'listing',
    mongoose.Schema({
        title: String,
        dateRange: {
            start: {
                year: Number,
                month: Number,
                day: Number,
                date: Date,
                timestamp: Number,
            },
            end: {
                year: Number,
                month: Number,
                day: Number,
                date: Date,
                timestamp: Number,
            },
        },
        timeSchedule: [{
            start: {
                hour: Number,
                minute: Number,
            },
            end: {
                hour: Number,
                minute: Number,
            },
            repeat: {
                daysOfWeek: String,
                daysOfMonth: String,
            },
        }],
        location: {
            bbox: {},
            lat: Number,
            lng: Number,
            country: String,
            state: String,
            zipcode: String,
            town: String,
            street: String,
            streetNumber: String,
            buildingUnit: String,
            notes: String,
        },
        requirements: {
            authentication: Number,
            proximity: Number,
            reputation: Number,
            stake: Number,
            badges: [String],
        },
        tasks: [{
            description: String,
            contact: String,
            completionCriteria: String,
        }],
        compensation: {
            currency: String,
            flatRate: Number,
            incrementalRate: {
                unit: String,
                ratePerUnit: Number,
            },
            escrow: {
                percentOfEstimatedTotal: Number,
                arbitrator: String,
                arbitratorFee: Number,
            },
        },
    })
);