const todaysForecast = {
    date: new Date(),
    weather: 'sunny',
};

// without destructuring
const logWeatherWithout = (forecast: { date: Date; weather: string }): void => {
    console.log(forecast.date);
    console.log(forecast.weather);
};
logWeatherWithout(todaysForecast);

// with destructuring
const logWeatherWith = ({ date, weather }: { date: Date; weather: string }): void => {
    console.log(date);
    console.log(weather);
};
logWeatherWith(todaysForecast);

const profile = {
    user: 'Pippo',
    age: 20,
    coordinates: {
        latitude: 42,
        longitude: 24,
    },
    setAge(age: number): void {
        this.age = age;
    },
};
                                                                                                                
// const { age }: { age: number } = profile;
// const { user }: { user: string } = profile;
const { age, user }: { age: number; user: string } = profile;
const {
    coordinates: { latitude, longitude },
}: { coordinates: { latitude: number; longitude: number } } = profile;
console.log(user, age, latitude, longitude)
