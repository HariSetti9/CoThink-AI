export const DATASET_VERSION = 'python-tracing-v2';
export const CONCEPTS = {
  "loops": "Loops and ranges",
  "lists": "List indexing",
  "conditions": "Boolean conditions",
  "strings": "String operations"
};
export const TASKS = [
  {"id":"pre-loops-1","phase":"pre","concept":"loops","prompt":"What prints?","code":"print(list(range(1,4)))","choices":["[1, 2, 3]","[1, 2, 3, 4]","[0, 1, 2, 3]"],"answer":0,"hint":"The stop value is excluded."},
  {"id":"pre-lists-1","phase":"pre","concept":"lists","prompt":"What prints?","code":"a=[4,8,12]\nprint(a[1])","choices":["4","8","12"],"answer":1,"hint":"Indices start at zero."},
  {"id":"pre-conditions-1","phase":"pre","concept":"conditions","prompt":"What prints?","code":"x=3\nprint(x>5)","choices":["True","False","3"],"answer":1,"hint":"Compare 3 with 5."},
  {"id":"pre-strings-1","phase":"pre","concept":"strings","prompt":"What prints?","code":"s = 'python'\nprint(s[0:2])","choices":["py","pyt","yt"],"answer":0,"hint":"A slice includes its start index and excludes its stop index."},
  {"id":"pre-loops-2","phase":"pre","concept":"loops","prompt":"What prints?","code":"print(list(range(2,5)))","choices":["[2, 3, 4]","[2, 3, 4, 5]","[0, 1, 2]"],"answer":0,"hint":"The stop value is excluded."},
  {"id":"pre-lists-2","phase":"pre","concept":"lists","prompt":"What prints?","code":"a=[10,20,30]\nprint(a[0])","choices":["20","10","30"],"answer":1,"hint":"The first index is zero."},
  {"id":"pre-conditions-2","phase":"pre","concept":"conditions","prompt":"What prints?","code":"print(4==5)","choices":["True","False","4"],"answer":1,"hint":"Equality compares both values."},
  {"id":"pre-strings-2","phase":"pre","concept":"strings","prompt":"What prints?","code":"s = 'code'\nprint(s[-1])","choices":["c","e","d"],"answer":1,"hint":"Index -1 selects the final character."},
  {"id":"practice-loops-1","phase":"practice","concept":"loops","prompt":"What prints?","code":"print(sum(range(1,4)))","choices":["10","6","3"],"answer":1,"hint":"List the values before summing."},
  {"id":"practice-lists-1","phase":"practice","concept":"lists","prompt":"What prints?","code":"a=[2, 5, 9]\nprint(a[-1])","choices":["2","5","9"],"answer":2,"hint":"Negative indices count from the end."},
  {"id":"practice-conditions-1","phase":"practice","concept":"conditions","prompt":"What prints?","code":"x=8\nprint(x%2==0)","choices":["True","False","8"],"answer":0,"hint":"The remainder after division by 2 is zero for even numbers."},
  {"id":"practice-strings-1","phase":"practice","concept":"strings","prompt":"What prints?","code":"s = 'debug'\nprint(s[1:4])","choices":["debu","bug","ebu"],"answer":2,"hint":"Trace the zero-based positions 1, 2 and 3."},
  {"id":"practice-loops-2","phase":"practice","concept":"loops","prompt":"What prints?","code":"print(sum(range(2,5)))","choices":["9","14","6"],"answer":0,"hint":"Add 2, 3 and 4."},
  {"id":"practice-lists-2","phase":"practice","concept":"lists","prompt":"What prints?","code":"a=[1, 4, 7]\nprint(a[-2])","choices":["1","4","7"],"answer":1,"hint":"Count backward from the last element."},
  {"id":"practice-conditions-2","phase":"practice","concept":"conditions","prompt":"What prints?","code":"print(7%2==0)","choices":["True","False","7"],"answer":1,"hint":"An odd number has remainder one."},
  {"id":"practice-strings-2","phase":"practice","concept":"strings","prompt":"What prints?","code":"s = 'learn'\nprint(s[-2:])","choices":["ar","rn","le"],"answer":1,"hint":"Start two characters from the end and continue to the end."},
  {"id":"transfer-loops-1","phase":"transfer","concept":"loops","prompt":"What prints?","code":"print(len(list(range(2,7))))","choices":["4","5","6"],"answer":1,"hint":"Count from 2 up to but not including 7."},
  {"id":"transfer-lists-1","phase":"transfer","concept":"lists","prompt":"What prints?","code":"a=[7, 3, 6, 1]\nprint(a[1]+a[-1])","choices":["8","4","9"],"answer":1,"hint":"Identify each index separately."},
  {"id":"transfer-conditions-1","phase":"transfer","concept":"conditions","prompt":"What prints?","code":"x=9\nprint(x%3==0 and x>10)","choices":["True","False","9"],"answer":1,"hint":"Both comparisons must be true."},
  {"id":"transfer-strings-1","phase":"transfer","concept":"strings","prompt":"What prints?","code":"s = 'planet'\nprint(s[:2] + s[-1])","choices":["pl","pnt","plt"],"answer":2,"hint":"Take the first two characters and append the final character."},
  {"id":"transfer-loops-2","phase":"transfer","concept":"loops","prompt":"What prints?","code":"print(len(list(range(3,9))))","choices":["5","6","7"],"answer":1,"hint":"Subtract start from stop."},
  {"id":"transfer-lists-2","phase":"transfer","concept":"lists","prompt":"What prints?","code":"a=[2, 8, 4, 3]\nprint(a[0]+a[-1])","choices":["5","11","6"],"answer":0,"hint":"Add first and last elements."},
  {"id":"transfer-conditions-2","phase":"transfer","concept":"conditions","prompt":"What prints?","code":"print(12%3==0 and 12>10)","choices":["True","False","12"],"answer":0,"hint":"Both comparisons are true."},
  {"id":"transfer-strings-2","phase":"transfer","concept":"strings","prompt":"What prints?","code":"s = 'robot'\nprint(s[1:3] + s[-1])","choices":["obt","rot","obo"],"answer":0,"hint":"Take positions 1 and 2, then append the final character."}
];
