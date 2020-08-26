import gravatar from '../../utils/gravatar';

test('Gravatar fuction test', () => {
  const email = 'asael.lr.23@gmail.com';
  //Check de gravatar
  //https://es.gravatar.com/site/check/
  const gravatarUrl = 'https://gravatar.com/avatar/c0dda050209d6906ddfb675b537f9afb';

  expect(gravatarUrl).toEqual(gravatar(email));
});
