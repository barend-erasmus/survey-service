function generatePermutations(lists, result, depth, current)
{
    if(depth == lists.length)
    {
       result.push(current);
       return;
     }

    for(var i = 0; i < lists[depth].length; ++i)
    {
        generatePermutations(lists, result, depth + 1, current + lists[depth][i]);
    }
}

var result = [];

generatePermutations([
  ['a', 'b', 'c'],
  ['1', '2', '3'],
  ['d', 'e', 'f'],
], result, 0, '');

console.log(result);