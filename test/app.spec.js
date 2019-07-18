const app = require('../src/app');
// expect and supertest available globally -- see test/setup.js

describe('GET /user', () => {
  it('GET / responds with 200 containing users', () => {
    return supertest(app)
      .get('/user')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
      });
  });
});

describe('POST /register', () => {
  it('POST /register responds with 201 containing newUser', () => {
    return supertest(app)
      .post('/register')
      .send({
        'username': 'FrodoBaggins',
        'password': 'shire4lyfe',
        'favoriteClub': 'Ogden Curling Club',
        'newsLetter': 'true'
      })
      .expect(201);
  });

  it('POST /register responds with 201 containing newUser if newsLetter is omitted', () => {
    return supertest(app)
      .post('/register')
      .send({
        'username': 'FrodoBaggins',
        'password': 'shire4lyfe',
        'favoriteClub': 'Ogden Curling Club',
      })
      .expect(201);
  });

  describe('POST /register validations', () => {
    describe('POST /register username validations', () => {
      it('POST /register responds with 400 when no username is provided', () => {
        return supertest(app)
          .post('/register')
          .send({
            'password': 'shire4lyfe',
            'favoriteClub': 'Ogden Curling Club',
            'newsLetter': 'true'})
          .expect(400, 'Username required');
      });
      
      it('POST /register responds with 400 with invalid username length', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'Frodo',
            'password': 'shire4lyfe',
            'favoriteClub': 'Ogden Curling Club',
            'newsLetter': 'true'
          })
          .expect(400, 'Username must be between 6 and 20 characters');
      });
    });
    
    describe('POST /register password validations', () => {
      it('POST /register responds with 400 if no password is provided', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'FrodoBaggins',
            'favoriteClub': 'Ogden Curling Club',
            'newsLetter': 'true'
          })
          .expect(400, 'Password required');
      });

      it('POST /register responds with 400 if password is invalid length', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'FrodoBaggins',
            'password': 'shire4',
            'favoriteClub': 'Ogden Curling Club',
            'newsLetter': 'true'
          })
          .expect(400, 'Password must be between 8 and 36 characters');
      });

      it('POST /register responds with 400 if password does not include number', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'FrodoBaggins',
            'password': 'shirelyfe',
            'favoriteClub': 'Ogden Curling Club',
            'newsLetter': 'true'
          })
          .expect(400, 'Password must contain at least one digit');
      });
    });

    describe('POST /register favoriteClub validation', () => {
      it('POST /register responds with 400 if favoriteClub is not included', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'FrodoBaggins',
            'password': 'shire4lyfe',
            'newsLetter': 'true'
          })
          .expect(400, 'Favorite club required');
      });

      it('POST /register responds with 400 if invalid club', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'FrodoBaggins',
            'password': 'shire4lyfe',
            'favoriteClub': 'Invalid Curling Club',
            'newsLetter': 'true'
          })
          .expect(400, 'Not a valid club');
      });
    });

  });
});

describe('DELETE /user/:userId', () => {
  it('DELETE /user/userId responds with 404 if user is not found', () => {
    return supertest(app)
      .delete('/user/invalidUserId')
      .expect(404, 'User not found');
  });

  it('DELETE /user/:userId responds with 204 if user is deleted', () => {
    return supertest(app)
      .delete('/user/3c8da4d5-1597-46e7-baa1-e402aed70d80')
      .expect(204);
  });
});