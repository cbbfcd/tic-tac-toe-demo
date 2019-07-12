# Tic-Tac-Toe

> tic-tac-toe

This is a reflection of an interview question. I have 7 days to complete this problem, so I want to do some interesting experiments!

The project was built using [parcel][1] and [dot][2].

The reason is simple enough and extremely fast!!

# question

'x' for player1, 'o' for player2, 'e' for empty. so wo get a chessboard like:

```
const chessboard = [
  ['x', 'o', 'o'],
  ['x', 'x', 'e'],
  ['e', 'o', 'e']
]
```

We will implement a method called 'winnerAlgorithm', it has two params: role & chessboard array. then return how many ways to win!

eg: 

```
winnerAlgorithm('x', chessboard); // {count=3, answer=[[2,2], [1,2], [2,0]]}
```


# how to run

I implemented a simple visual interface, so you can easily implement shuffle the chessboard's operations by clicking a button named 'shuffle the chessboard'.

then click the btn named 'go!' to get the answer!

1. first install the parcel
    
    ```
    yarn global add parcel-bundler
    ```

2. then

    ```
    git clone ...
    yarn add ...
    yarn start // then visited http://localhost:1234
    ```

3. AI

if you want to try a AI tic-tac-toe

```
yarn run ai // then visited http://localhost:1234
```

you will get a tic-tac-toe game by alpha beta pruning!

4. performance

you can see a echarts for performance of the tic-tac-toe algorithms

```
yarn run perf
```

# more about

This demo is divided into two parts. The basic algorithm part contains index.html file and index.js file. The AI part includes ai.html file, alphabeta.js file and ai.js file.

so, can we hava a try to add AI in Tic-Tac-Toe game?

let's do it!

Here need to understand two algorithms:

1. [Minimax][3]
2. [Alpha-Beta Pruning][4]

# Performance

I simply called the core algorithm 10,000 times and plotted the required run time with a line chart. you can try <pre>yarn run perf</pre>

# end 

The code is rough and not very modular. If you have a better implementation, please mention a PR

[1]:https://github.com/parcel-bundler/parcel
[2]: https://olado.github.io/doT/
[3]: http://web.cs.ucla.edu/~rosen/161/notes/alphabeta.html
[4]: https://www.zhihu.com/question/27221568