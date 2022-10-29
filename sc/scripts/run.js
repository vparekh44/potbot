const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const emojiContractFactory = await hre.ethers.getContractFactory("EmojiStates");
    const emojiContract = await emojiContractFactory.deploy();
    await emojiContract.deployed();

    console.log("Contract deployed to:", emojiContract.address);
    console.log("Contract deployed by:", owner.address);

    /* LFB */
    await emojiContract.getTotalEmojis();

    const firstEmojiTxn = await emojiContract.sendEmoji();
    await firstEmojiTxn.wait();

    await emojiContract.getTotalEmojis();

    const secondEmojiTxn = await emojiContract.connect(randomPerson).sendEmoji();
    await secondEmojiTxn.wait();

    await emojiContract.getTotalEmojis();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();