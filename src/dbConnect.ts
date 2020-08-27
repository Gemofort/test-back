import * as mongoose from 'mongoose';

type TInput = {
  uri: string;
};

export default ({ uri }: TInput) => {
  const connect = () => {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Successfully connected to database');
      })
      .catch((error) => {
        console.error('Error connecting to database: ', error);
      });
  };

  connect();

  mongoose.connection.on('disconnected', connect);
};
