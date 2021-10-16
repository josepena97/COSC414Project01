# COSC414Project01
Marieke Gutter-Spence (43435445)
Jose Pena Revelo ()

# 
The super bug zapper is a 2-D interactive game developed using JavaScript and WebGL. The game implements a variety of different features.

# Features:
1. The playing field starts as a circular disk centered at the origin.
2. The player views the disk from above.
3. Bacteria grow on the circumference of the disk starting at an arbitrary spot on the circumference and growing out uniformly in each direction from that spot at a speed determined by the game.
4. The player needs to eradicate the bacteria by placing the mouse over the bacteria and hitting a button.
5. The effect of the poison administered is to immediately remove the poisoned bacteria.
6. The game can randomly generate up to a fixed number (say 10) of different bacteria (each with a different color).
7. The bacteria appear as a crust on the circumference of the disk.
8. The game gains points through the delays in the user responding and by any specific bacteria reaching a threshold (for example,a 30-degree arc).
9. The player wins if all bacteria are poisoned before any twodifferent bacteria reach the threshold mentioned above.


# Bonus Features implemented:

1. When a bacterial culture is hit, use a simple 2D particle system to simulate an explosion at the point where the poison is administered.
2. The effect of the poison administered also propagates outward from the point of insertion of the position until all the bacteria are destroyed.
