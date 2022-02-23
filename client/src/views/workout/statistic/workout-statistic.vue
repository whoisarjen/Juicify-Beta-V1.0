<template>
    <div class="contenerLOGGED">
        <v-sparkline
        :value="value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="width"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth"
        
        >
            <template v-slot:label="item">
            {{ item.value }}kg
            </template>
        </v-sparkline>
        <div style="margin-top: 50px"/>
        <v-sparkline
        :value="value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="width"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth"
        
        >
            <template v-slot:label="item">
            {{ item.value }}kg
            </template>
        </v-sparkline>
        <div style="margin-top: 50px"/>
        <v-sparkline
        :value="value"
        :gradient="gradient"
        :smooth="radius || false"
        :padding="padding"
        :line-width="width"
        :stroke-linecap="lineCap"
        :gradient-direction="gradientDirection"
        :fill="fill"
        :type="type"
        :auto-line-width="autoLineWidth"
        
        >
            <template v-slot:label="item">
            {{ item.value }}kg
            </template>
        </v-sparkline>
        <div style="margin-top: 50px"/>
    </div>
</template>

<script>
  const gradients = [
    ['#222'],
    // ['#42b3f4'],
    // ['red', 'orange', 'yellow'],
    // ['purple', 'violet']
  ]

  export default {
    data: () => ({
      width: 10,
      radius: 0,
      padding: 10,
      lineCap: 'round',
      gradient: gradients[3],
    //   value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      value: [100, 91, 0, 91.2, 91.4, 91.5, 91.6],
      gradientDirection: 'bottom',
      gradients,
      fill: false,
      type: 'bar',
      autoLineWidth: false,
    }),
  }
</script>