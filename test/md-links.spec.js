const mdLinks = require('../index.js');
jest.setTimeout(10000);

describe('Verificar si es una funcion ', () => {

    test('Verificar si es una funcion ', () => {
        expect(typeof mdLinks).toEqual('function');
    });

    test('mdLinks(path, options) para el primer link del archivo', () => {
        return mdLinks('test/zarela', { validate: false, stats: false })
            .then(response => expect(response[0].href).toBe('https://nodejs.org/es/about/'));
    });

    test('La funcion mdLinks debería de tener la propiedad text', () => {
        return mdLinks('test/zarela', { validate: false, stats: false })
            .then(response => expect(response[0].text).toEqual('Acerca de Node.js - Documentación oficial'));
    });
    test('La funcion mdLinks debería de tener la propiedad file', () => {
        return mdLinks('test/zarela', { validate: false, stats: false })
            .then(response => expect(response[0].file).toEqual('D:\\2018\\lim20181-Track-FE-markdown-list\\test\\zarela/README22.md'));
    });
    test('La funcion mdLinks debería de tener la propiedad statusText', () => {
        return mdLinks('test/zarela', { validate: true, stats: false })
            .then(response => expect(response[0].statusText).toEqual('fail'));
    });
    test('La funcion mdLinks debería de tener la propiedad status', () => {
        return mdLinks('test/zarela', { validate: true, stats: false })
            .then(response => expect(response[0].status).toEqual(404));
    });

    test('deberia retornar total: 5, unique : 4 para --stats', () => {
        let options = {
            validate: false,
            stats: true,
        }
        return mdLinks('test/zarela', options).then(response => {
            expect(response).toEqual({"total": 5, "uniques": 4});
        })
      });

      test('deberia retornar total: 5, unique : 4 para --validate --stats', () => {
        let options = {
            validate: true,
            stats: true,
        }
        return mdLinks('test/zarela', options).then(response => {
            expect(response).toEqual({"broken": 1, "total": 5, "uniques": 4});
        })
      });

});


