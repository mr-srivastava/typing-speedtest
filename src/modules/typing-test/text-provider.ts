const texts: string[] = [
  'Why did the chicken cross the road. To get to the other side of course. But along the way it probably stopped for some snacks or maybe even found a worm or two. Chickens are unpredictable like that. You never know what kind of adventure they are on next. And honestly who could blame them. The grass is always greener.',

  'If cats could talk they probably would not. They would just give you that judgmental stare that says I see you trying to get my attention but I am not impressed. Yet at the same time they know they run the house. You think you are the owner but really they are the ones in charge. Cats are basically royalty.',

  'There is always that one sock that mysteriously disappears after doing laundry. Is there a secret sock dimension where all the missing socks go. Or maybe they have just decided to start a new life elsewhere free from the tyranny of the sock drawer. Whatever the case may be the sock mystery remains unsolved forever destined to keep us wondering.',

  'Have you ever noticed how dogs act like they have not seen you in years when you have only been gone for five minutes. That level of excitement is unmatched. They wag their tails so hard you think they might take off. And all because you just went to the mailbox. Dogs really know how to make you feel like a rockstar.',

  'Why is it that the moment you sit down to relax that is when you suddenly remember all the things you forgot to do. Oh I forgot to take the trash out. Oops I need to reply to that email. Wait when did I leave the stove on. It is like your brain has a built in reminder system that only activates when you are completely comfortable.',

  'Imagine if we could eat pizza for every meal without any consequences. It would be a world filled with endless cheesy slices. Toppings galore and maybe even pizza for dessert. But let us be real we would probably get tired of it after a week. Or maybe not. Pizza has a way of always staying delicious no matter how much you eat. The pizza dream lives on.',

  'The best way to wake up is with a good cup of coffee and the knowledge that you do not have to do anything productive that day. It is a rare treat and when it happens you feel like you have unlocked the ultimate level of relaxation. That is until you remember that laundry exists. Or dishes. But let us pretend for a second that it is all taken care of.',

  'Why do we press harder on the remote control when we know the batteries are running low. It is like we think the extra force will magically give it more power. As if remote controls run on sheer willpower and determination. Eventually we give up and change the batteries but for a brief moment we believe in the impossible.',

  'What if elevators played dramatic music every time you stepped in. Just imagine the suspense building as you slowly rise to the next floor. By the time you reach your destination you would feel like you are about to reveal a grand secret. Elevator rides would be way more entertaining especially if there was a big drumroll at the end.',

  'Every time you see a squirrel running around chasing after nuts you cannot help but think that squirrel has got its life together. It has goals it is on a mission. Meanwhile you are sitting there just trying to remember where you put your phone five minutes ago. Squirrels are the true icons of productivity.',

  'Why do we always crave breakfast food late at night. Pancakes waffles eggs they somehow taste better when it is way past dinner time. Maybe it is because breakfast foods are like the comfort blankets of meals. They remind us of lazy weekend mornings and simple joys in life. Midnight pancakes are basically happiness on a plate.',

  'You know that feeling when you are typing and you make a typo so bad that even autocorrect is like nope I cannot help you here. It is at that moment you question every typing skill you thought you had. Suddenly you are wondering how you even managed to type your name correctly this whole time.',

  'Remember when you were a kid and you thought quicksand was going to be a much bigger problem in life. It seemed like every adventure movie had people getting stuck in quicksand left and right. But now you realize quicksand is surprisingly rare and you spend more time avoiding traffic than dangerous sand traps.',

  'Ever tried to balance your phone on your pillow while lying in bed. It is like playing the most intense game of jenga. One wrong move and that phone is coming down right on your face. It is a dangerous game we all play but somehow we keep coming back for more. The ultimate test of balance and gravity.',

  'Have you ever noticed how the internet can turn the most mundane question into an hour long research session. You start by looking up something simple like the weather and next thing you know you are reading about the history of weather forecasting in ancient civilizations. How does it happen every single time.',

  'The snack aisle at the grocery store is like a treasure hunt. You walk in for one thing but suddenly you are leaving with a cart full of chips candy and snacks you did not even know existed. It is like the snacks call out to you. And no matter how hard you try to resist somehow they always find their way into your cart and eventually into your pantry.',

  'Ever notice how dogs just know when you are about to leave the house. The second you reach for your keys they look at you with those big sad eyes like you are about to embark on a world tour without them. You almost feel guilty leaving even though you know you are only going to the grocery store for five minutes.',

  'There is something about eating cereal at night that feels rebellious. Like you are breaking the rules of breakfast. You pour the milk grab your favorite spoon and suddenly it is like the ultimate comfort food. Maybe it is the late night quiet or maybe cereal just tastes better when it is not supposed to.',

  'You ever think about how chairs are just there quietly supporting us through life. They are always reliable holding us up without complaint whether we are working resting or even thinking about lifes mysteries. Shoutout to all the chairs out there being the unsung heroes of comfort and productivity.',

  'Bubble wrap is proof that sometimes the simplest things in life are the most fun. You can spend hours popping those tiny bubbles without a care in the world. It is like a mini celebration for your fingers with every pop. You may have grown up but popping bubble wrap never gets old.',
];

export default function getText() {
  return texts[Math.floor(Math.random() * texts.length)];
}
