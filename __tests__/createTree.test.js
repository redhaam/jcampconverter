import { readFileSync } from 'fs';

import createTree from '../src/createTree';

const route = `${__dirname}/data/mestrec/`;

describe('Test from Mestrec Jcamp generator with assignment', () => {
  it('real example', () => {
    let result = createTree(readFileSync(`${route}mestrec.jdx`, 'utf8'));
    expect(result).toHaveLength(1);
  });

  it('simple case', () => {
    let result = createTree(readFileSync(`${route}simple.jdx`, 'utf8'));
    expect(result).toStrictEqual([
      {
        title: 'first level 1',
        dataType: 'first',
        jcamp: '##TITLE= first level 1\n##DATA TYPE=\tfirst\n##END=\n',
        children: [
          {
            title: 'second level 1',
            dataType: 'second',
            jcamp: '##TITLE= second level 1\n##DATA_TYPE= second\n##END=\n',
            children: [],
          },
          {
            title: 'second level 2',
            dataType: 'second',
            jcamp: '##TITLE= second level 2\n##DATATYPE= second\n##END=\n',
            children: [
              {
                title: 'third level',
                jcamp: '##TITLE= third level\n##END=\n',
                children: [],
              },
            ],
          },
        ],
      },
      {
        title: 'first level 2',
        dataType: 'first',
        jcamp: '##TITLE= first level 2\n##DATA-TYPE=\tfirst\n##END=\n',
        children: [],
      },
    ]);
  });

  it('simple case with flatten', () => {
    let result = createTree(readFileSync(`${route}simple.jdx`, 'utf8'), {
      flatten: true,
    });

    expect(result).toStrictEqual([
      {
        children: undefined,
        title: 'first level 1',
        jcamp: '##TITLE= first level 1\n##DATA TYPE=\tfirst\n##END=\n',
        dataType: 'first',
      },
      {
        children: undefined,
        title: 'second level 1',
        jcamp: '##TITLE= second level 1\n##DATA_TYPE= second\n##END=\n',
        dataType: 'second',
      },
      {
        children: undefined,
        title: 'second level 2',
        jcamp: '##TITLE= second level 2\n##DATATYPE= second\n##END=\n',
        dataType: 'second',
      },
      {
        children: undefined,
        title: 'third level',
        jcamp: '##TITLE= third level\n##END=\n',
      },
      {
        children: undefined,
        title: 'first level 2',
        jcamp: '##TITLE= first level 2\n##DATA-TYPE=\tfirst\n##END=\n',
        dataType: 'first',
      },
    ]);
  });

  it('simple case with mulfiline', () => {
    let result = createTree(readFileSync(`${route}verySimple.jdx`, 'utf8'));

    expect(result).toStrictEqual([
      {
        title: 'first level 1\nsecond line',
        jcamp: '##TITLE= first level 1\nsecond line\n##END=\n',
        children: [
          {
            title: 'second level 1',
            jcamp: '##TITLE= second level 1\n##DATA_TYPE= second\n##END=\n',
            children: [],
            dataType: 'second',
          },
        ],
      },
    ]);
  });

  it('test with bruker FID / FT combined file', () => {
    let result = createTree(
      readFileSync(`${__dirname}/data/bruker_fid_ft.jdx`, 'utf8'),
    );
    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
  });
});

test('from UV Jcamp with tree', () => {
  let result = createTree(
    readFileSync(`${__dirname}/data/tree-uv.jdx`, 'latin1'),
  );
  expect(result).toHaveLength(1);
  expect(result[0].children).toHaveLength(2);
});
