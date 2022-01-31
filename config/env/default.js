'use strict';

module.exports = {
  domain: 'http://gitlab.sociallyshoppable.com',
  resultsLimit: 10, // number of results returned on request
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  db: {
    //uri: 'mongodb://127.0.0.1/ss',
    uri: 'mongodb://user:user_ss@157.230.93.220/ss',
     options: {
      useMongoClient: true,
	  autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0
    }
  },
  twotap: {

    publicToken: 'bc35986ded29131f39f1e0b11250c3',
    // publicToken: '56842635c4b9b3fa82b222e29f24e8', // yahoo
    // publicToken: 'c6ba4e4b8728bf182c63a8ee4cb67e', // gmail
    // publicToken: '6d0e68bb519fbf83ca229a876463f2', //desparado2010@yahoo.com
    // publicToken: 'e1f4d3811042d33b643677b3280f6c', // yahoo

    privateToken: '0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24',
   // privateToken: '7d57cea803701d9efda6d27cdf9a37550fb5fa59978433c301'  // yahoo
    // privateToken: 'f025898a79ff81df3c2b0f9b90d19e4a7f147835aa7ad8febd' // gmail
    // privateToken: '592b0afc65af267b409120dbfe8ff18477d31ddd727ae80df5' //@desparado2010@yahoo.com
    // privateToken: 'c5c7f51f3c684cf739b35584e0f244be969006d1c4cf117a0b' // rajib.brunel
     http_confirm_url: 'http://104.236.166.98/confirm',
     http_finished_url: 'http://104.236.166.98/finish'
  },
  prosperent: {
    apiKey: '0da1ade1627ce72127d551d52d5b55e7'
  },
  sendgrid: {
    apiKey: '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',
    from: 'logistics@sociallyshoppable.com'
  },
  admin : {
	email : 'rajib.2002bd@gmail.com',
	name : 'Anthony Flores'
	},
 assistant : {
	email : 'ai@sociallyshoppable.com',
    name : 'AI '
 },
  purchaselist: [],
  express: {
    prevPort: 800,
    port: 4040,
    session: {
      secret: 'ssshhhhh',
      resave: false,
      saveUninitialized: true
    }
  },
  uploads: {
    imageUpload: {
      dest: '/uploads/images/', // Profile upload destination path
      limits: {
        fileSize: 3 * 2048 * 2048 // Max file size in bytes (3 MB)
      }
    }
  },

  // initialize object
  files: {
    server: {
      models: [],
      routes: []
    }
  },
  facebook: {
   // clientID: '1758879584358914',
   // clientSecret: 'e7b6661c025c73b795bd8ef750169f7f',
    clientID: '328805820802009',
    clientSecret: '434c60fa1b8343518037c61be015edc0',
   	callbackURL: '/api/auth/facebook/callback'
  },
  instagram: {
    clientID: '935f145cf97044a7b8b9168201fc18d1',
    clientSecret: '669fe3b6eb614c0dabb7e188d83f3b0c',
    callbackURL: '/api/auth/instagram/callback'
  },
  twitter: {
    clientID: 'rCCiT22Kq17fXNU7o7qumbCwS',
    clientSecret: 'pUWrq5x91kLsL1W00ujR4sL95qySJOxhwET1an8NNzOmOcjPUj',
    callbackURL: '/api/auth/twitter/callback'
  }
};
