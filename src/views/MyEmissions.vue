<template>
  <div
    class="w-full h-full flex flex-col !blur-0 dark:bg-[#181B34] dark:text-white overflow-hidden overflow-y-scroll"
  >
    <div
      class="p-4 border-b dark:border-b-[#2e3250] flex justify-between items-center"
    >
      <div class="text-lg">My Emissions</div>
      <div class="flex items-center">
        Total Emission:
        <number
          class="mx-2"
          ref="number1"
          :from="0"
          :to="totalEmission"
          :format="theFormat"
          :duration="0.3"
          :delay="0"
          easing="Power1.easeOut"
        />
        kgCO2eq
      </div>
      <button
        type="button"
        @click="offsetEmission()"
        class="monday-style-button monday-style-button--size-medium monday-style-button--kind-primary monday-style-button--color-primary has-style-size"
        data-testid="button"
        aria-disabled="false"
      >
        Offset Emission
      </button>
    </div>
    <div class="w-full h-full flex flex-row">
      <div class="w-96 h-full flex flex-col">
        <div class="p-2 px-4">
          <div>Category</div>
        </div>
        <div class="w-full h-full p-3 pt-0">
          <div
            class="p-3 m-2 rounded-lg text-gray-900 dark:text-gray-100 border-green-300 bg-green-50 dark:border-green-900 dark:bg-[#1e224b] border border-l-4 flex justify-between items-center cursor-pointer"
            :class="{ ' !border-green-600': category.selected }"
            @click="selectCategory(category)"
            v-for="(category, index) in categories"
            :key="index"
          >
            <div>
              {{ category.title }}
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path
                d="M13.5303 9.46967L13 10L13.5303 10.5303C13.8232 10.2374 13.8232 9.76256 13.5303 9.46967ZM11.9393 10L5.46967 16.4697C5.17678 16.7626 5.17678 17.2374 5.46967 17.5303C5.76256 17.8232 6.23744 17.8232 6.53033 17.5303L13.5303 10.5303L13 10L13.5303 9.46967L6.53033 2.46967C6.23744 2.17678 5.76256 2.17678 5.46967 2.46967C5.17678 2.76256 5.17678 3.23744 5.46967 3.53033L11.9393 10Z"
                class="fill-green-800"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="w-full h-full flex flex-col" v-if="selectedCategory">
        <div class="text-2xl py-3 flex justify-between pr-3">
          <div class="flex items-center">
            {{ selectedCategory.title }}
            <div
              class="bg-blue-600 bg-opacity-40 text-sm ml-2 p-1 px-3 rounded-full"
            >
              <number
                ref="number1"
                :from="0"
                :to="selectedCategoryEmission"
                :format="theFormat"
                :duration="0.3"
                :delay="0"
                easing="Power1.easeOut"
              />
              kgCO2eq
            </div>
          </div>
          <!-- {{ totalEmission }} -->
          <div>
            <!-- Category Emission -->
          </div>
          <button
            type="button"
            @click="save"
            class="monday-style-button monday-style-button--size-small monday-style-button--kind-primary monday-style-button--color-primary has-style-size"
          >
            Save
          </button>
        </div>
        <div
          class="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-5"
        >
          <div
            class="w-full bg-white dark:bg-[#181B34] dark:border-[#2e3250] rounded-lg border max-w-md"
            v-for="(subCategory, index) in selectedCategory.subCategories"
            :key="index"
          >
            <div
              class="flex justify-between items-center text-sm p-2 border-b dark:border-[#2e3250]"
            >
              <div class="flex justify-start items-center">
                <div class="bg-blue-500 bg-opacity-5 p-1 px-2 rounded-lg">
                  {{ subCategory.title }}
                </div>
              </div>
              <div class="flex items-center">
                <div v-if="selectedCategory.title != 'Electricity'">
                  {{
                    Number(
                      (subCategory.value * subCategory.co2Emission).toFixed(2)
                    )
                  }}
                  {{ subCategory.unit }}
                </div>
                <div v-else>
                  {{
                    Number(calculateElectricity(subCategory.value).toFixed(2))
                  }}
                  {{ subCategory.unit }}
                </div>
                <!-- {{ world * subCategory.value }} -->
              </div>
            </div>
            <div class="p-2 py-3">
              <div class="opacity-80">{{ subCategory.label }}</div>

              <!-- <div>{{ getTimeInHoursAndMins(15000) }}</div> -->
              <div class="pr-3 opacity-60 text-sm">
                {{ subCategory.value }} {{ subCategory.unitOfMeasurment }}
              </div>
              <div class="flex items-center py-2 px-0">
                <input
                  id="large-range"
                  type="range"
                  :min="subCategory.minValue"
                  :max="subCategory.maxValue"
                  v-model="subCategory.value"
                  class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

import { isEmpty, prop, reduce, maxBy, either, isNil, pipe, join } from "ramda";
import {
  transport,
  meal,
  streaming,
  purchase,
  fashion,
  food,
  electricity,
  getInternetUsageCarbonImpact,
  TransportType,
} from "carbon-footprint";
import forEach from "ramda/src/forEach";

const getFlightType = (duration) => {
  /* Below 3 hours */
  if (duration < 180) {
    return TransportType.shortHaulFlight;
  }

  /* Between 3 and 6 hours */
  if (duration < 360) {
    return TransportType.mediumHaulFlight;
  }

  /* Above 6 hours */
  return TransportType.longHaulFlight;
};

const toKWH = (x) => (x * 3.6) / Math.pow(10, -6);
const toKgCO2 = (x) => x * 1000;
const getCarbonIntensityInGramPerKWHromKgPerJoules = pipe(
  toKWH,
  toKgCO2,
  Math.round
);

const getFlightEmissionValue = (duration) => {
  switch (getFlightType(duration)) {
    case TransportType.shortHaulFlight: {
      /* Paris -> Toulouse 1h15 AF6122 588 km */
      /* Paris -> Stockholm 2h35 AF1462 1543 km */
      const averageSpeedShortHaulSpeed =
        ((588 * 1000) / (60 + 15) + (1543 * 1000) / (2 * 60 + 35)) / 2;
      return averageSpeedShortHaulSpeed * duration;
    }
    case TransportType.mediumHaulFlight: {
      /* Paris -> Istanbul 3h25 AF1390 2255 km */
      /* Paris -> Dakar 5h45 AF718 4205 km */
      const averageMediumHaulSpeed =
        ((2255 * 1000) / (3 * 60 + 25) + (4205 * 1000) / (5 * 60 + 45)) / 2;
      return averageMediumHaulSpeed * duration;
    }
    case TransportType.longHaulFlight: {
      /* Paris -> New York 8h15 AF22 5837 km */
      /* Paris -> Santiago 14h30 AF406 11648 km */
      const averageLongHaulSpeed =
        ((5837 * 1000) / (8 * 60 + 15) + (11648 * 1000) / (14 * 60 + 30)) / 2;
      return averageLongHaulSpeed * duration;
    }
    default:
      return 0;
  }
};

export default {
  name: "calculate-emission",
  created() {
    this.selectCategory(this.categories[0]);
    this.calculateTotalEmission();
  },
  data() {
    return {
      totalEmission: 0,
      selectedCategoryEmission: 0,
      world: electricity.world,
      categories: [
        {
          id: 1,
          title: "Meal",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "High Meat",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.highMeat,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 2,
              title: "Medium Meat",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.mediumMeat,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 3,
              title: "Low Meat",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.lowMeat,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 4,
              title: "Pescetarian",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.pescetarian,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 5,
              title: "Vegetarian",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.vegetarian,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 6,
              title: "Vegan",
              value: 0,
              label: "Quantity",
              unitOfMeasurment: "meal(s)",
              co2Emission: meal.vegan,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
          ],
        },
        {
          id: 2,
          title: "Transport",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Train",
              value: 150,
              label: "Distance",
              unitOfMeasurment: "kilometer(s)",
              co2Emission: transport.train * 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
            {
              id: 2,
              title: "Car",
              value: 150,
              label: "Distance",
              unitOfMeasurment: "kilometer(s)",
              co2Emission: transport.car * 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
            {
              id: 3,
              title: "Bus",
              value: 150,
              label: "Distance",
              unitOfMeasurment: "kilometer(s)",
              co2Emission: transport.bus * 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
            // {
            //   id: 4,
            //   title: "Plane",
            //   value: 150,
            //   label: "Duration",
            //   unitOfMeasurment: "0 hour(s) and 20 minute(s)",
            //   co2Emission: transport.plane * 1000,
            //   unit: "kgCO2eq",
            //   minValue: 0,
            //   maxValue: 1000,
            // },
            {
              id: 5,
              title: "Boat",
              value: 150,
              label: "Distance",
              unitOfMeasurment: "kilometer(s)",
              co2Emission: transport.boat * 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
            {
              id: 6,
              title: "Motorbike",
              value: 150,
              label: "Distance",
              unitOfMeasurment: "kilometer(s)",
              co2Emission: transport.motorbike * 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
          ],
        },
        // {
        //   id: 3,
        //   title: "Streaming",
        //   selected: false,
        //   subCategories: [
        //     {
        //       id: 1,
        //       title: "Audio - Mp3",
        //       value: 169,
        //       label: "Duration",
        //       unitOfMeasurment: "0 hour(s) and 20 minute(s)",
        //       co2Emission: streaming.audioMP3,
        //       unit: "gCO2eq",
        //       minValue: 0,
        //       maxValue: 36000,
        //     },
        //     {
        //       id: 2,
        //       title: "Video - Hd",
        //       value: 169,
        //       label: "Duration",
        //       unitOfMeasurment: "0 hour(s) and 20 minute(s)",
        //       co2Emission: streaming.HDVideo,
        //       unit: "gCO2eq",
        //       minValue: 0,
        //       maxValue: 36000,
        //     },
        //     {
        //       id: 3,
        //       title: "Video - Fullhd/1080p",
        //       value: 169,
        //       label: "Duration",
        //       unitOfMeasurment: "0 hour(s) and 20 minute(s)",
        //       co2Emission: streaming.fullHDVideo,
        //       unit: "gCO2eq",
        //       minValue: 0,
        //       maxValue: 36000,
        //     },
        //     {
        //       id: 4,
        //       title: "Video - Ultrahd/4k",
        //       value: 169,
        //       label: "Duration",
        //       unitOfMeasurment: "0 hour(s) and 20 minute(s)",
        //       co2Emission: streaming.ultraHDVideo,
        //       unit: "gCO2eq",
        //       minValue: 0,
        //       maxValue: 36000,
        //     },
        //   ],
        // },
        {
          id: 4,
          title: "Purchase",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Smartphone",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.smartphone,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 2,
              title: "Laptop",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.laptop,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 3,
              title: "Tablet",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.tablet,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 4,
              title: "Computer",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.computer,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 5,
              title: "Television",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.tv,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 6,
              title: "Electric Car",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.eletricCar,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 7,
              title: "Fossil Fuel Car",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.fossilFuelCar,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 8,
              title: "Hybrid Car",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.hybridCar,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 9,
              title: "Crypto Currency Transaction",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.cryptoCurrencyPoW,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 10,
              title: "Single Edition Nft",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: purchase.singleEditionNFT,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
          ],
        },
        {
          id: 5,
          title: "Fashion",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Coat",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.coat,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 2,
              title: "Dress",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.dress,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 3,
              title: "Jeans",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.jeans,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 4,
              title: "Shirt",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.shirt,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 5,
              title: "Shoes",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.shoes,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 6,
              title: "Sweater",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.sweater,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
            {
              id: 7,
              title: "T-Shirt",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "item(s)",
              co2Emission: fashion.tshirt,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 20,
            },
          ],
        },
        {
          id: 6,
          title: "Food",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Red Meat",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.redMeat / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 2,
              title: "White Meat",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.whiteMeat / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 3,
              title: "Coffee",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.coffee / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 4,
              title: "Chocolate",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.chocolate / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 5,
              title: "Fish",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.fish / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 6,
              title: "Lamp",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.lamb / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 7,
              title: "Beef",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.beef / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 8,
              title: "Cheese",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.cheese / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 9,
              title: "Pork",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.pork / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 10,
              title: "Turkey",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.turkey / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 11,
              title: "Chicken",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.chicken / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 12,
              title: "Tuna",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.tuna / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 13,
              title: "Eggs",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.eggs / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 14,
              title: "Potatoes",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.potatoes / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 15,
              title: "Rice",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.rice / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 16,
              title: "Nuts",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.nuts / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 17,
              title: "Beans",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.beans / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 18,
              title: "Tofu",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.tofu / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 19,
              title: "Vegetables",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.vegetables / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 20,
              title: "Milk",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.milk / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 21,
              title: "Fruit",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.fruit / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
            {
              id: 22,
              title: "Lentils",
              value: 0,
              label: "Quanity",
              unitOfMeasurment: "grams",
              co2Emission: food.lentils / 1000,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 500,
            },
          ],
        },
        {
          id: 7,
          title: "Electricity",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Custom",
              value: 0,
              label: "Electricity consumption",
              unitOfMeasurment: "kWh",
              co2Emission: electricity.world,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
          ],
        },
        {
          id: 8,
          title: "Custom",
          selected: false,
          subCategories: [
            {
              id: 1,
              title: "Custom",
              value: 0,
              label: "Quanitity of emission",
              unitOfMeasurment: "kgCO2eq",
              co2Emission: 1,
              unit: "kgCO2eq",
              minValue: 0,
              maxValue: 1000,
            },
          ],
        },
      ],
      selectedCategory: null,
    };
  },
  computed: {},
  methods: {
    theFormat(number) {
      return number ? number.toFixed(2) : number;
    },
    selectCategory(cat) {
      this.categories.forEach((category) => {
        category.selected = false;
        if (category.title == cat.title) {
          category.selected = true;
          monday.storage.instance
            .getItem("category-" + category.id)
            .then((res) => {
              if (res.data) {
                var subCategoryItems = JSON.parse(res.data.value);
                if (subCategoryItems) {
                  subCategoryItems.forEach((item) => {
                    category.subCategories.forEach((subCategory) => {
                      if (item.id == subCategory.id) {
                        if (category.title == "Electricity") {
                          subCategory.value = this.calculateElectricity(
                            item.value
                          );
                        } else {
                          subCategory.value = item.value;
                        }
                      }
                    });
                  });
                }
              }
              this.selectedCategory = category;
              this.calculateTotalEmissionPerCategory();
              this.selectedCategory.subCategories.forEach((subCategory) => {});
            });
        }
      });
    },
    calculateElectricity(value) {
      return (
        (getCarbonIntensityInGramPerKWHromKgPerJoules(value) *
          electricity.world) /
        1000
      );
    },
    save() {
      if (this.selectedCategory) {
        var submittedValueItems = [];
        this.selectedCategory.subCategories.forEach((subCategory) => {
          if (subCategory.value * 1 > 0) {
            submittedValueItems.push({
              id: subCategory.id,
              value: subCategory.value * 1,
            });
          }
        });

        var submittedValue = JSON.stringify(submittedValueItems);
        monday.storage.instance
          .setItem("category-" + this.selectedCategory.id, submittedValue)
          .then((res) => {
            this.calculateTotalEmission();
            this.calculateTotalEmissionPerCategory();
          });
      }
    },
    calculateTotalEmission() {
      this.totalEmission = 0;
      this.categories.forEach((category) => {
        monday.storage.instance
          .getItem("category-" + category.id)
          .then((res) => {
            if (res.data) {
              var subCategoryItems = JSON.parse(res.data.value);
              if (subCategoryItems) {
                subCategoryItems.forEach((item) => {
                  category.subCategories.forEach((subCategory) => {
                    if (subCategory.id === item.id) {
                      this.totalEmission =
                        this.totalEmission +
                        item.value * subCategory.co2Emission;
                    }
                  });
                });
              }
            }
          });
      });
    },
    calculateTotalEmissionPerCategory() {
      this.selectedCategoryEmission = 0;
      monday.storage.instance
        .getItem("category-" + this.selectedCategory.id)
        .then((res) => {
          if (res.data) {
            var subCategoryItems = JSON.parse(res.data.value);
            if (subCategoryItems) {
              subCategoryItems.forEach((item) => {
                this.selectedCategory.subCategories.forEach((subCategory) => {
                  if (subCategory.id === item.id) {
                    this.selectedCategoryEmission =
                      this.selectedCategoryEmission +
                      item.value * subCategory.co2Emission;
                  }
                });
              });
            }
          }
        });
    },
    offsetEmission() {
      window
        .open("https://offset.climateneutralnow.org/AllProjects", "_blank")
        .focus();
    },
  },
};
</script>
