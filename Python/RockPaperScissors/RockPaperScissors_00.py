import random

def horline():
    print('\n----------------------------------------')

def check_winner(player, bot):
    if player == bot:
        return "It's a draw!"
    elif (player == 'rock' and bot == 'scissors') or\
         (player == 'paper' and bot == 'rock') or\
         (player == 'scissors' and bot == 'paper'):
        return 'You WIN!'
    else:
        return 'You lose...'
        

print('\n!!! Welcome to Rock Paper Scissors !!!\n')
try:
    amount = int(input('How many games do you want to play: '))
    horline()

    player_score = 0
    bot_score = 0
    choice = ['rock', 'paper', 'scissors']
    for _ in range(amount):
        playerin = input('\nEnter your choice (rock, paper, scissors): ').lower()

        if playerin not in choice:
            print('Invalid input! Skipping round.')
            continue

        bot_choice = random.choice(choice)
        result = check_winner(playerin, bot_choice)
        print(f'Bot chose: {bot_choice}')
        print()
        print(result)

        if result == 'You WIN!':
            player_score += 1
        elif result == 'You lose...':
            bot_score += 1

        print(f'\nScore: You({player_score}) | Bot({bot_score})')
        horline()

except ValueError as err:
    print(f'Invalid input: {err}')
except Exception as err:
    print(f'Unexpected error: {err}')